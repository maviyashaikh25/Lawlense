const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    fileUrl: {
      type: String, // S3 / Cloudinary / local
      required: true,
    },

    preprocessedText: {
      type: String, // used for NLP + BERT
    },

    summary: {
      type: String, // AI generated summary
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    documentType: {
      type: String,
      enum: [
        "judgement", 
        "act", 
        "case", 
        "notes", 
        "Judgment", 
        "Contract", 
        "Legal Notice", 
        "Other"
      ],
      default: "case",
    },

    isProcessed: {
      type: Boolean,
      default: false, // becomes true after NLP pipeline
    },
    
    clauses: [
      {
        title: { type: String }, // e.g., "Confidentiality"
        description: { type: String },
        original_text: { type: String },
        risk: { type: String }, // low, medium, high
        section: { type: String }, // Section 1.2
        confidence: { type: Number },
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
