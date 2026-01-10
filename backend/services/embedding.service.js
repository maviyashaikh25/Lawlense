const axios = require("axios");

exports.generateEmbedding = async (text) => {
  try {
    const response = await axios.post("http://localhost:8000/embed", {
        text,
    });
    return response.data.embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error.message);
    throw error;
  }
};
