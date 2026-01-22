const axios = require("axios");

exports.generateEmbedding = async (text) => {
  try {
    const response = await axios.post("https://law-ml.onrender.com/embed", {
        text,
    });
    return response.data.embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error.message);
    throw error;
  }
};
