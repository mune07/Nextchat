import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import { getConversationName, getConversationAvatar, getLastMessagePreview, formatTime, getOtherMember } from '../utils/helpers.js';

const ConversationItem = ({ conversation, isActive, onClick }) => {
    const { authUser } = useAuthStore();
    const { onlineUsers } = useChatStore();

    const name = getConversationName(conversation, authUser);
    const avatar = getConversationAvatar(conversation, authUser);
    const preview = getLastMessagePreview(conversation.lastMessage, authUser);
    const time = conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : '';
    const otherMember = !conversation.isGroup ? getOtherMember(conversation, authUser) : null;
    const isOnline = otherMember ? onlineUsers.includes(otherMember._id) : false;
    const isUnread = conversation.lastMessage &&
        !conversation.lastMessage.seenBy?.includes(authUser._id) &&
        conversation.lastMessage.sender?._id !== authUser._id;

    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl cursor-pointer transition-all duration-200 mb-1"
            style={{
                background: isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid rgba(255,255,255,0.25)' : '1px solid transparent',
                backdropFilter: isActive ? 'blur(10px)' : 'none',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
        >
            <div className="relative flex-shrink-0">
                <div className="w-11 h-11 rounded-full overflow-hidden" style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)' }}>
                            {name?.[0]?.toUpperCase()}
                        </div>
                    )}
                </div>
                {!conversation.isGroup && isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full" style={{ border: '2px solid #312e81' }}></span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-semibold truncate text-white">{name}</span>
                    {time && (
                        <span className="text-xs flex-shrink-0 ml-2" style={{ color: isUnread ? '#a5b4fc' : 'rgba(255,255,255,0.4)' }}>
                            {time}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-xs truncate" style={{ color: isUnread ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)' }}>
                        {preview}
                    </p>
                    {isUnread && <span className="ml-2 flex-shrink-0 w-2 h-2 bg-indigo-300 rounded-full"></span>}
                </div>
            </div>
        </div>
    );
};

export default ConversationItem;