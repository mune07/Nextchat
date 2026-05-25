import express from 'express';
import {
    getOrCreatePrivateConversation,
    createGroupConversation,
    getUserConversations,
    getConversationById,
    updateGroupInfo,
} from '../controllers/conversationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserConversations);
router.post('/group', protect, createGroupConversation);
router.get('/:id', protect, getConversationById);
router.put('/:id/group', protect, updateGroupInfo);
router.post('/private/:userId', protect, getOrCreatePrivateConversation);

export default router;