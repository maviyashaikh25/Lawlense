const Groq = require("groq-sdk");
const { semanticSearch } = require("./pinecone.service");

let groq;
try {
    groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });
} catch (error) {
    // Groq API Key missing or invalid, chat service will fail if used.
}


exports.chatWithDocuments = async (question) => {
  if (!groq) {
      throw new Error("Groq client not initialized. Check API Key.");
  }

  // 1️⃣ Retrieve relevant chunks
  const results = await semanticSearch(question);

  const context = results
    .map((r, i) => `Source ${i + 1}: ${r.metadata.text || r.metadata.chunk_text || "No text available"}`)
    .join("\n\n");

  // 2️⃣ Build RAG prompt
  const prompt = `
You are a legal AI assistant.
Answer the question strictly using the provided context.
If the answer is not present, say "Information not found in the document."

Context:
${context}

Question:
${question}

Answer:
`;

  // 3️⃣ Call Groq LLM
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // Updated to current supported model
    messages: [
      { role: "system", content: "You are a helpful legal assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  return response.choices[0].message.content;
};
