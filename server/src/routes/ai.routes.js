const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const { analyzeTicketController } = require("../controllers/ai.controller");

router.post("/analyze", authMiddleware, analyzeTicketController);

module.exports = router;
