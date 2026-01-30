const axios = require("axios");

exports.generateEmbedding = async (text) => {
  try {
    const ML_HOST = process.env.ML_SERVICE_HOST || '127.0.0.1';
    const ML_PORT = process.env.ML_SERVICE_PORT || 8000;
    const response = await axios.post(`http://${ML_HOST}:${ML_PORT}/embed`, {
        text,
    });
    return response.data.embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error.message);
    throw error;
  }
};
