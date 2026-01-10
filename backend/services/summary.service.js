const axios = require("axios");

exports.generateSummary = async (text) => {
  try {
    const response = await axios.post("http://localhost:8000/summarize", {
        text,
    });
    return response.data.summary;
  } catch (error) {
    console.error("Summary generation failed:", error.message);
    return null; // Return null instead of throwing to avoid breaking the whole flow
  }
};
