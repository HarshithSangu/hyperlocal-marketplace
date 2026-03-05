const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createConversation,
  getConversations,
  getMessages,
  sendMessage
} = require("../controllers/chatController");

router.post("/conversation", auth, createConversation);
router.get("/conversations", auth, getConversations);
router.get("/messages/:conversationId", auth, getMessages);
router.post("/message", auth, sendMessage);

module.exports = router;