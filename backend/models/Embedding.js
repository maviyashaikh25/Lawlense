const mongoose = require("mongoose");

const embeddingSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    chunkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DocumentChunk",
      required: true,
    },

    vector: {
      type: [Number], // embedding array
      required: true,
    },

    modelName: {
      type: String,
      default: "sentence-transformers/all-MiniLM-L6-v2",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Embedding", embeddingSchema);
