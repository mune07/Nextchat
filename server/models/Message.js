import mongoose from 'mongoose';

const reactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        emoji: {
            type: String,
        },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            default: '',
        },
        image: {
            type: String,
            default: '',
        },
        imagePublicId: {
            type: String,
            default: '',
        },
        messageType: {
            type: String,
            enum: ['text', 'image', 'mixed'],
            default: 'text',
        },
        reactions: [reactionSchema],
        seenBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        deletedFor: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;