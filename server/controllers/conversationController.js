import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import Message from '../models/Message.js';

export const getOrCreatePrivateConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ message: 'Cannot create conversation with yourself' });
        }

        const otherUser = await User.findById(userId);
        if (!otherUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        let conversation = await Conversation.findOne({
            isGroup: false,
            members: { $all: [currentUserId, userId], $size: 2 },
        })
            .populate('members', '-password')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'fullName username profilePic' },
            });

        if (!conversation) {
            conversation = await Conversation.create({
                isGroup: false,
                members: [currentUserId, userId],
            });
            conversation = await conversation.populate('members', '-password');
        }

        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const createGroupConversation = async (req, res) => {
    try {
        const { name, members } = req.body;
        const currentUserId = req.user._id;

        if (!name || !members || members.length < 2) {
            return res.status(400).json({ message: 'Group name and at least 2 members are required' });
        }

        const allMembers = [...new Set([...members, currentUserId.toString()])];

        const conversation = await Conversation.create({
            name,
            isGroup: true,
            members: allMembers,
            admins: [currentUserId],
            createdBy: currentUserId,
        });

        const populated = await conversation.populate('members', '-password');

        return res.status(201).json(populated);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: req.user._id,
        })
            .populate('members', '-password')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'fullName username profilePic' },
            })
            .sort({ updatedAt: -1 });

        return res.status(200).json(conversations);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getConversationById = async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            members: req.user._id,
        })
            .populate('members', '-password')
            .populate({
                path: 'lastMessage',
                populate: { path: 'sender', select: 'fullName username profilePic' },
            });

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' });
        }

        return res.status(200).json(conversation);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateGroupInfo = async (req, res) => {
    try {
        const { name } = req.body;
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            isGroup: true,
            admins: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ message: 'Group not found or not an admin' });
        }

        if (name) conversation.name = name;

        if (req.body.groupAvatar) {
            const { v2: cloudinary } = await import('cloudinary');
            if (conversation.groupAvatarPublicId) {
                await cloudinary.uploader.destroy(conversation.groupAvatarPublicId);
            }
            const result = await cloudinary.uploader.upload(req.body.groupAvatar, {
                folder: 'nexchat/groups',
                transformation: [{ width: 300, height: 300, crop: 'fill' }],
            });
            conversation.groupAvatar = result.secure_url;
            conversation.groupAvatarPublicId = result.public_id;
        }

        await conversation.save();
        const updated = await conversation.populate('members', '-password');
        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};