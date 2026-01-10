const mongoose = require("mongoose");

const caseEmbeddingSchema = new mongoose.Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  embedding: {
    type: [Number],  // Array of numbers for vector
    required: true,
  },
  documentType: String,
}, { timestamps: true });

module.exports = mongoose.model("CaseEmbedding", caseEmbeddingSchema);
