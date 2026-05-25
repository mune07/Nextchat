export const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

export const getConversationName = (conversation, authUser) => {
    if (conversation.isGroup) return conversation.name;
    const other = conversation.members.find((m) => m._id !== authUser._id);
    return other?.fullName || 'Unknown';
};

export const getConversationAvatar = (conversation, authUser) => {
    if (conversation.isGroup) return conversation.groupAvatar || null;
    const other = conversation.members.find((m) => m._id !== authUser._id);
    return other?.profilePic || null;
};

export const getOtherMember = (conversation, authUser) => {
    return conversation.members.find((m) => m._id !== authUser._id);
};

export const getLastMessagePreview = (lastMessage, authUser) => {
    if (!lastMessage) return 'No messages yet';
    if (lastMessage.messageType === 'image') return '📷 Image';
    if (lastMessage.sender?._id === authUser._id) return `You: ${lastMessage.text}`;
    return lastMessage.text;
};

export const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const getAvatarFallback = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};