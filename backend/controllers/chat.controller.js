const { chatWithDocuments } = require("../services/chat.service");

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ message: "Question is required" });
    }

    const answer = await chatWithDocuments(question);

    res.status(200).json({ answer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chatbot failed", error: error.message });
  }
};
