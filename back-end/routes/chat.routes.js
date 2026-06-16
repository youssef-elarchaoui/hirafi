// routes/chat.routes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getConversations, getMessages, getOrderMessages, deleteMessage } = require('../controllers/chatController');

router.use(protect);

router.get('/conversations', getConversations);
router.get('/messages/:userId', getMessages);
router.get('/orders/:orderId/messages', getOrderMessages);
router.delete('/messages/:id', deleteMessage);

module.exports = router;