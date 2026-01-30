// Delete Document by ID
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Remove file from disk if exists
    if (document.fileUrl && fs.existsSync(document.fileUrl)) {
      fs.unlinkSync(document.fileUrl);
    }

    // Remove related embeddings
    const CaseEmbedding = require("../models/CaseEmbedding");
    await CaseEmbedding.deleteMany({ documentId: document._id });

    // Decrement Storage
    const User = require("../models/User");
    // We need file size. If we didn't store it in Document, we might need to check fs.statSync BEFORE unlink.
    // However, Document model doesn't seem to store size. Let's check if we can get it from disk.
    let fileSize = 0;
    if (document.fileUrl && fs.existsSync(document.fileUrl)) {
        const stats = fs.statSync(document.fileUrl);
        fileSize = stats.size;
    }
    
    if (fileSize > 0) {
        await User.findByIdAndUpdate(req.user.id, { $inc: { storageUsed: -fileSize } });
    }

    // Delete document
    await document.deleteOne();

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete document", error: error.message });
  }
};
const Document = require("../models/Document");
const axios = require("axios");
const { extractTextFromPDF } = require("../services/pdf.service");
const { preprocessText } = require("../services/nlp.service.js");

const fs = require("fs");

// Upload Document

// Upload PDF & Extract Text
exports.uploadAndExtractPDF = async (req, res) => {
  try {
    // Multer ensures file exists
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const { title, description, documentType } = req.body;

    // 1️⃣ Check limits
    const documentCount = await Document.countDocuments({ uploadedBy: req.user.id });
    if (documentCount >= 3) {
        // Clean up uploaded file immediately
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ message: "Upload limit reached (Max 3 documents)." });
    }

    //  Create document record first
    const document = await Document.create({
      title,
      description,
      documentType,
      fileUrl: req.file.path,
      uploadedBy: req.user.id,
      isProcessed: false,
    });
    
    // Update User Storage
    const User = require("../models/User");
    await User.findByIdAndUpdate(req.user.id, { $inc: { storageUsed: req.file.size } });


    //  Extract text from PDF
    const extractedText = await extractTextFromPDF(req.file.path);
    const preprocessedText = await preprocessText(extractedText);
    const ML_HOST = process.env.ML_SERVICE_HOST || '127.0.0.1';
    const ML_PORT = process.env.ML_SERVICE_PORT || 8000;
    const response = await axios.post(`http://${ML_HOST}:${ML_PORT}/classify`, {
      text: preprocessedText,
    });
    const { document_type, confidence } = response.data;

    // 6️⃣ Save results to DB
    document.preprocessedText = preprocessedText;
    document.documentType = document_type;
    document.classificationConfidence = confidence;
    
    // Increment AI Queries (1 for classification)
    await User.findByIdAndUpdate(req.user.id, { $inc: { aiQueriesUsed: 1 } });


    // 🆕 Generate Summary
    try {
      const { generateSummary } = require("../services/summary.service");
      const summary = await generateSummary(preprocessedText);
      if (summary) {
        document.summary = summary;
      }
    } catch (summaryError) {
      console.error(
        "Summary generation failed, continuing:",
        summaryError.message
      );
    }

    // 🆕 Extract Clauses
    try {
      const ML_HOST = process.env.ML_SERVICE_HOST || '127.0.0.1';
      const ML_PORT = process.env.ML_SERVICE_PORT || 8000;
      const clauseResponse = await axios.post(`http://${ML_HOST}:${ML_PORT}/extract_clauses`, {
        text: preprocessedText,
      });
      if (clauseResponse.data) {
         document.clauses = clauseResponse.data;
      }
    } catch (clauseError) {
       console.error("Clause extraction failed, continuing:", clauseError.message);
    }

    document.isProcessed = true;
    await document.save();

    // 7. Generate & Save Embedding
    try {
      const { generateEmbedding } = require("../services/embedding.service");
      const CaseEmbedding = require("../models/CaseEmbedding");

      const embedding = await generateEmbedding(preprocessedText);

      await CaseEmbedding.create({
        documentId: document._id,
        embedding,
        documentType: document.documentType,
      });
    } catch (embeddingError) {
      console.error(
        "Embedding generation failed, but continuing:",
        embeddingError.message
      );
      // We don't fail the whole upload if embedding fails, but we should log it.
    }

    // 8. Upsert to Pinecone for RAG
    try {
        const { upsertDocument } = require("../services/pinecone.service");
        // Use extractedText (raw) or preprocessedText (cleaned)?
        // For RAG source context, raw extracted text is usually better for reading, 
        // but preprocessed is better for semantic match.
        // Let's use preprocessed for consistency with embedding.
        // Actually, let's use extractedText if available for better readability in chat, 
        // but the embeddings are generated from the text passed to it.
        // The ML service embeds what it gets.
        // Let's stick to preprocessedText as that's what we used for other embeddings.
        await upsertDocument(document._id, preprocessedText);
    } catch (pineconeError) {
        console.error("Pinecone upsert failed:", pineconeError.message);
    }

    res.status(201).json({
      message: "PDF uploaded and text extracted and processed  successfully ",
      documentId: document._id,
    });
  } catch (error) {
    console.error(error);

    // Clean up uploaded file if failure
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "PDF processing failed",
      error: error.message,
    });
  }
};

// Get My Documents

exports.getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      uploadedBy: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// Get Document By ID

exports.getDocumentById = async (req, res) => {
  try {
    console.log(`[getDocumentById] Requested ID: ${req.params.id}, User ID: ${req.user.id}`);
    
    // Check if ID is valid ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        console.log(`[getDocumentById] Invalid ObjectId: ${req.params.id}`);
        return res.status(400).json({ message: "Invalid Document ID format" });
    }

    const document = await Document.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!document) {
      console.log(`[getDocumentById] Document not found in DB for this user.`);
      return res.status(404).json({ message: "Document not found" });
    }

    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch document" });
  }
};
