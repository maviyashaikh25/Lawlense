const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getMyDocuments,
  getDocumentById,
  uploadAndExtractPDF,
  deleteDocument,
} = require("../controllers/document.controller");


// Delete document by ID
router.delete("/:id", authMiddleware, deleteDocument);
const { uploadPDF } = require("../middleware/upload.middleware");

// Upload PDF + extract text
router.post(
  "/upload",
  authMiddleware,
  uploadPDF.single("pdf"),
  uploadAndExtractPDF
);

// Get all user documents
router.get("/", authMiddleware, getMyDocuments);

// Get single document
router.get("/:id", authMiddleware, getDocumentById);

module.exports = router;
