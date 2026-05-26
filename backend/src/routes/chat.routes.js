// src/routes/chat.routes.js
const { Router } = require("express");
const { chat }   = require("../controllers/chat.controller");

const router = Router();

// POST /api/chat
router.post("/", chat);

module.exports = router;
