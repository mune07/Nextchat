import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import { getCloudinary } from '../utils/cloudinaryConfig.js';
import { io } from '../server.js';
import { getReceiverSocketIds } from '../socket/socketHandler.js';

export const sendMessage = async (req, res) => {
    try {
        const { conversationId, text } = req.body;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: senderId,
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        let imageUrl = '';
        let imagePublicId = '';
        let messageType = 'text';

        if (req.body.image && req.body.image.startsWith('data:image')) {
            try {
                const cld = getCloudinary();
                const uploadResult = await cld.uploader.upload(req.body.image, {
                    folder: 'nexchat/messages',
                    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
                });
                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;
                messageType = text ? 'mixed' : 'image';
            } catch (uploadError) {
                console.error('IMAGE UPLOAD ERROR:', uploadError.message);
                return res.status(500).json({ message: 'Image upload failed: ' + uploadError.message });
            }
        }

        const message = await Message.create({
            conversationId,
            sender: senderId,
            text: text || '',
            image: imageUrl,
            imagePublicId,
            messageType,
            seenBy: [senderId],
        });

        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message._id,
            updatedAt: new Date(),
        });

        const populated = await message.populate('sender', 'fullName username profilePic');

        const otherMembers = conversation.members.filter(
            (m) => m.toString() !== senderId.toString()
        );

        otherMembers.forEach((memberId) => {
            const socketIds = getReceiverSocketIds(memberId.toString());
            socketIds.forEach((socketId) => {
                io.to(socketId).emit('newMessage', {
                    message: populated,
                    conversationId,
                });
            });
        });

        return res.status(201).json(populated);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { page = 1, limit = 40 } = req.query;

        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        const messages = await Message.find({
            conversationId,
            deletedFor: { $nin: [req.user._id] },
        })
            .populate('sender', 'fullName username profilePic')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        return res.status(200).json(messages.reverse());
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const markMessagesAsSeen = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        await Message.updateMany(
            {
                conversationId,
                seenBy: { $nin: [userId] },
                sender: { $ne: userId },
            },
            { $addToSet: { seenBy: userId } }
        );

        const conversation = await Conversation.findById(conversationId);
        const otherMembers = conversation.members.filter(
            (m) => m.toString() !== userId.toString()
        );

        otherMembers.forEach((memberId) => {
            const socketIds = getReceiverSocketIds(memberId.toString());
            socketIds.forEach((socketId) => {
                io.to(socketId).emit('messagesSeen', { conversationId, seenBy: userId });
            });
        });

        return res.status(200).json({ message: 'Messages marked as seen' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const addReaction = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        const existingIndex = message.reactions.findIndex(
            (r) => r.user.toString() === userId.toString()
        );

        if (existingIndex !== -1) {
            if (message.reactions[existingIndex].emoji === emoji) {
                message.reactions.splice(existingIndex, 1);
            } else {
                message.reactions[existingIndex].emoji = emoji;
            }
        } else {
            message.reactions.push({ user: userId, emoji });
        }

        await message.save();
        const populated = await message.populate('sender', 'fullName username profilePic');

        const conversation = await Conversation.findById(message.conversationId);
        conversation.members.forEach((memberId) => {
            const socketIds = getReceiverSocketIds(memberId.toString());
            socketIds.forEach((socketId) => {
                io.to(socketId).emit('reactionUpdated', {
                    message: populated,
                    conversationId: message.conversationId,
                });
            });
        });

        return res.status(200).json(populated);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });

        await Message.findByIdAndUpdate(messageId, {
            $addToSet: { deletedFor: userId },
        });

        return res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};