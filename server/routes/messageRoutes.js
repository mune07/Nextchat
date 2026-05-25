import express from 'express';
import {
    sendMessage,
    getMessages,
    markMessagesAsSeen,
    addReaction,
    deleteMessage,
} from '../controllers/messageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:conversationId', protect, getMessages);
router.put('/:conversationId/seen', protect, markMessagesAsSeen);
router.put('/:messageId/reaction', protect, addReaction);
router.delete('/:messageId', protect, deleteMessage);

export default router;