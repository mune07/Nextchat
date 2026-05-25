import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: '',
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        groupAvatar: {
            type: String,
            default: '',
        },
        groupAvatarPublicId: {
            type: String,
            default: '',
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
            default: null,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;