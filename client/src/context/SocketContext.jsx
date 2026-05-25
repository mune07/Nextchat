import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [socketReady, setSocketReady] = useState(false);
    const { authUser } = useAuthStore();
    const {
        addIncomingMessage,
        setOnlineUsers,
        updateMessagesSeen,
        updateReaction,
        setTypingUser,
    } = useChatStore();

    useEffect(() => {
        if (!authUser) {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocketReady(false);
            }
            return;
        }

        const socket = io(import.meta.env.VITE_SERVER_URL || '/', {
            query: { userId: authUser._id },
            withCredentials: true,
        });

        socketRef.current = socket;
        setSocketReady(true);

        socket.on('onlineUsers', (users) => setOnlineUsers(users));

        socket.on('newMessage', ({ message, conversationId }) => {
            addIncomingMessage(message, conversationId);
        });

        socket.on('messagesSeen', ({ conversationId, seenBy }) => {
            updateMessagesSeen(conversationId, seenBy);
        });

        socket.on('reactionUpdated', ({ message, conversationId }) => {
            updateReaction(message, conversationId);
        });

        socket.on('userTyping', ({ conversationId, userId }) => {
            setTypingUser(conversationId, userId, true);
        });

        socket.on('userStopTyping', ({ conversationId, userId }) => {
            setTypingUser(conversationId, userId, false);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
            setSocketReady(false);
        };
    }, [authUser]);

    const joinConversation = (conversationId) => {
        socketRef.current?.emit('joinConversation', conversationId);
    };

    const leaveConversation = (conversationId) => {
        socketRef.current?.emit('leaveConversation', conversationId);
    };

    const emitTyping = (conversationId, userId) => {
        socketRef.current?.emit('typing', { conversationId, userId });
    };

    const emitStopTyping = (conversationId, userId) => {
        socketRef.current?.emit('stopTyping', { conversationId, userId });
    };

    const value = {
        socket: socketReady ? socketRef.current : null,
        joinConversation,
        leaveConversation,
        emitTyping,
        emitStopTyping,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
};