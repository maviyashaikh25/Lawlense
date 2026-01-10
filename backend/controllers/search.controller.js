const CaseEmbedding = require("../models/CaseEmbedding");
const Document = require("../models/Document");
const { generateEmbedding } = require("../services/embedding.service");
const { cosineSimilarity } = require("../services/similarity.service");

exports.semanticSearch = async (req, res) => {
  try {
    const { query, documentType } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // 1️⃣ Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // 2️⃣ Fetch all document embeddings (optionally filtered)
    const filter = documentType ? { documentType } : {};
    const embeddings = await CaseEmbedding.find(filter);

    // 3️⃣ Calculate similarity
    const scoredResults = embeddings.map((item) => ({
      documentId: item.documentId,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }));

    // 4️⃣ Sort by similarity
    scoredResults.sort((a, b) => b.score - a.score);

    // 5️⃣ Fetch document details
    const topResults = await Promise.all(
      scoredResults.slice(0, 5).map(async (result) => {
        const doc = await Document.findById(result.documentId);
        return {
          id: doc._id,
          title: doc.title,
          description: doc.description,
          documentType: doc.documentType,
          score: result.score.toFixed(3),
        };
      })
    );

    res.status(200).json(topResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Semantic search failed" });
  }
};
