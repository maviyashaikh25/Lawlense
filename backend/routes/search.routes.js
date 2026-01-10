const express = require("express");
const router = express.Router();
const { semanticSearch } = require("../controllers/search.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/search", authMiddleware, semanticSearch);

module.exports = router;
