const axios = require("axios");

exports.generateSummary = async (text) => {
  try {
    const ML_HOST = process.env.ML_SERVICE_HOST || '127.0.0.1';
    const ML_PORT = process.env.ML_SERVICE_PORT || 8000;
    const response = await axios.post(`http://${ML_HOST}:${ML_PORT}/summarize`, {
        text,
    });
    return response.data.summary;
  } catch (error) {
    console.error("Summary generation failed:", error.message);
    return null; // Return null instead of throwing to avoid breaking the whole flow
  }
};
