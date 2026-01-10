// server/services/nlp.service.js

import natural from "natural";

const tokenizer = new natural.WordTokenizer();

const STOP_WORDS = new Set([
  "the",
  "is",
  "and",
  "or",
  "of",
  "to",
  "in",
  "for",
  "with",
  "on",
  "by",
  "an",
  "a",
]);

export const preprocessText = (text) => {
  if (!text) return "";

  // 1. Lowercase
  let cleanedText = text.toLowerCase();

  // 2. Remove punctuation (keep numbers)
  cleanedText = cleanedText.replace(/[^a-z0-9\s]/g, " ");

  // 3. Tokenize
  let tokens = tokenizer.tokenize(cleanedText);

  // 4. Remove stopwords
  tokens = tokens.filter((word) => !STOP_WORDS.has(word));

  // 5. Remove very short tokens
  tokens = tokens.filter((word) => word.length > 2);

  // 6. Rejoin tokens
  return tokens.join(" ");
};
