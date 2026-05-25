import { create } from 'zustand';
import axiosInstance from '../utils/axios.js';
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    isLoadingConversations: false,
    isLoadingMessages: false,
    typingUsers: {},
    onlineUsers: [],
    searchResults: [],
    isSearching: false,

    setOnlineUsers: (users) => set({ onlineUsers: Array.isArray(users) ? users : [] }),

    fetchConversations: async () => {
        set({ isLoadingConversations: true });
        try {
            const res = await axiosInstance.get('/conversations');
            set({ conversations: Array.isArray(res.data) ? res.data : [] });
        } catch {
            set({ conversations: [] });
        } finally {
            set({ isLoadingConversations: false });
        }
    },

    setActiveConversation: (conversation) => {
        set({ activeConversation: conversation, messages: [] });
    },

    fetchMessages: async (conversationId) => {
        set({ isLoadingMessages: true });
        try {
            const res = await axiosInstance.get(`/messages/${conversationId}`);
            set({ messages: Array.isArray(res.data) ? res.data : [] });
        } catch {
            set({ messages: [] });
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (data) => {
        try {
            const res = await axiosInstance.post('/messages', data);
            set((state) => ({ messages: [...state.messages, res.data] }));
            set((state) => ({
                conversations: [...state.conversations]
                    .map((c) =>
                        c._id === data.conversationId
                            ? { ...c, lastMessage: res.data, updatedAt: new Date().toISOString() }
                            : c
                    )
                    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
            }));
            return res.data;
        } catch {
            toast.error('Failed to send message');
            return null;
        }
    },

    addIncomingMessage: (message, conversationId) => {
        const { activeConversation } = get();
        if (activeConversation?._id === conversationId) {
            set((state) => ({ messages: [...state.messages, message] }));
        }
        set((state) => ({
            conversations: [...state.conversations]
                .map((c) =>
                    c._id === conversationId
                        ? { ...c, lastMessage: message, updatedAt: new Date().toISOString() }
                        : c
                )
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
        }));
    },

    getOrCreatePrivateConversation: async (userId) => {
        try {
            const res = await axiosInstance.post(`/conversations/private/${userId}`);
            const existing = get().conversations.find((c) => c._id === res.data._id);
            if (!existing) {
                set((state) => ({ conversations: [res.data, ...state.conversations] }));
            }
            return res.data;
        } catch {
            toast.error('Failed to open conversation');
            return null;
        }
    },

    createGroupConversation: async (data) => {
        try {
            const res = await axiosInstance.post('/conversations/group', data);
            set((state) => ({ conversations: [res.data, ...state.conversations] }));
            toast.success('Group created!');
            return res.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create group');
            return null;
        }
    },

    markAsSeen: async (conversationId) => {
        try {
            await axiosInstance.put(`/messages/${conversationId}/seen`);
        } catch { }
    },

    updateMessagesSeen: (conversationId, seenBy) => {
        set((state) => ({
            messages: state.messages.map((m) =>
                m.conversationId === conversationId && !m.seenBy?.includes(seenBy)
                    ? { ...m, seenBy: [...(m.seenBy || []), seenBy] }
                    : m
            ),
        }));
    },

    addReaction: async (messageId, emoji) => {
        try {
            const res = await axiosInstance.put(`/messages/${messageId}/reaction`, { emoji });
            set((state) => ({
                messages: state.messages.map((m) => (m._id === messageId ? res.data : m)),
            }));
        } catch {
            toast.error('Failed to add reaction');
        }
    },

    updateReaction: (message, conversationId) => {
        const { activeConversation } = get();
        if (activeConversation?._id === conversationId) {
            set((state) => ({
                messages: state.messages.map((m) => (m._id === message._id ? message : m)),
            }));
        }
    },

    setTypingUser: (conversationId, userId, isTyping) => {
        set((state) => ({
            typingUsers: {
                ...state.typingUsers,
                [conversationId]: isTyping
                    ? [...new Set([...(state.typingUsers[conversationId] || []), userId])]
                    : (state.typingUsers[conversationId] || []).filter((id) => id !== userId),
            },
        }));
    },

    searchUsers: async (query) => {
        if (!query.trim()) { set({ searchResults: [] }); return; }
        set({ isSearching: true });
        try {
            const res = await axiosInstance.get(`/auth/search?query=${encodeURIComponent(query)}`);
            set({ searchResults: Array.isArray(res.data) ? res.data : [] });
        } catch {
            set({ searchResults: [] });
        } finally {
            set({ isSearching: false });
        }
    },

    clearSearch: () => set({ searchResults: [], isSearching: false }),
}));