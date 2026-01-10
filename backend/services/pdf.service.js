const fs = require("fs");
const pdfParse = require("pdf-parse");

/**
 * Extract text from PDF
 */
const extractTextFromPDF = async (filePath) => {
  try {
    console.log("[PDF Extract] Reading file:", filePath);
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    console.log("[PDF Extract] Raw pdfData:", pdfData);
    const cleanedText = pdfData.text
      ? pdfData.text.replace(/\s+/g, " ").replace(/\n+/g, "\n").trim()
      : "";
    console.log("[PDF Extract] Cleaned text length:", cleanedText.length);
    return cleanedText;
  } catch (error) {
    console.error("PDF extraction failed (non-fatal):", error);
    // Return empty string so the upload can still succeed
    return "";
  }
};

module.exports = {
  extractTextFromPDF,
};
