import User from '../models/User.js';

const userSocketMap = {};

export const getReceiverSocketIds = (userId) => {
    return userSocketMap[userId] || [];
};

const socketHandler = (io) => {
    io.on('connection', async (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId && userId !== 'undefined' && userId !== 'null') {
            if (!userSocketMap[userId]) {
                userSocketMap[userId] = [];
            }
            userSocketMap[userId].push(socket.id);

            try {
                await User.findByIdAndUpdate(userId, { isOnline: true, socketId: socket.id });
            } catch { }

            io.emit('onlineUsers', Object.keys(userSocketMap));
        }

        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
        });

        socket.on('leaveConversation', (conversationId) => {
            socket.leave(conversationId);
        });

        socket.on('typing', ({ conversationId, userId: typingUserId }) => {
            socket.to(conversationId).emit('userTyping', { conversationId, userId: typingUserId });
        });

        socket.on('stopTyping', ({ conversationId, userId: typingUserId }) => {
            socket.to(conversationId).emit('userStopTyping', { conversationId, userId: typingUserId });
        });

        socket.on('disconnect', async () => {
            if (userId && userId !== 'undefined' && userId !== 'null') {
                if (userSocketMap[userId]) {
                    userSocketMap[userId] = userSocketMap[userId].filter((id) => id !== socket.id);
                    if (userSocketMap[userId].length === 0) {
                        delete userSocketMap[userId];
                        try {
                            await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date(), socketId: '' });
                        } catch { }
                    }
                }
                io.emit('onlineUsers', Object.keys(userSocketMap));
            }
        });
    });
};

export default socketHandler;