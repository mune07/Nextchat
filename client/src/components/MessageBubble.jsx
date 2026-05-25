import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import { formatTime } from '../utils/helpers.js';

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

const MessageBubble = ({ message, isGroup }) => {
    const { authUser } = useAuthStore();
    const { addReaction } = useChatStore();
    const [showReactions, setShowReactions] = useState(false);

    const isMine = message.sender?._id === authUser._id;
    const isSeenByOther = message.seenBy?.some((id) => id !== authUser._id);

    const groupedReactions = message.reactions?.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className={`flex items-end gap-2 group mb-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
            {isGroup && !isMine && (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-violet flex items-center justify-center flex-shrink-0 mb-1 shadow-sm">
                    <span className="text-white text-xs font-bold">{message.sender?.fullName?.[0]?.toUpperCase()}</span>
                </div>
            )}

            <div className={`flex flex-col max-w-xs lg:max-w-md ${isMine ? 'items-end' : 'items-start'}`}>
                {isGroup && !isMine && (
                    <span className="text-xs text-primary-500 font-semibold mb-1 ml-1">{message.sender?.fullName}</span>
                )}

                <div className="relative">
                    <div
                        className={`relative ${isMine ? 'message-bubble-sent' : 'message-bubble-received'}`}
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => setShowReactions(false)}
                    >
                        {message.image && (
                            <img
                                src={message.image}
                                alt="attachment"
                                className="rounded-xl max-w-full mb-1 max-h-60 object-cover cursor-pointer"
                                onClick={() => window.open(message.image, '_blank')}
                            />
                        )}
                        {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}

                        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <span className={`text-xs ${isMine ? 'text-primary-200' : 'text-surface-400'}`}>
                                {formatTime(message.createdAt)}
                            </span>
                            {isMine && (
                                isSeenByOther ? (
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.293 9.293a1 1 0 011.414 0L7 12.586l9.293-9.293a1 1 0 111.414 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5 text-primary-300" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.293 9.293a1 1 0 011.414 0L7 12.586l9.293-9.293a1 1 0 111.414 1.414l-10 10a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                )
                            )}
                        </div>

                        {showReactions && (
                            <div className={`absolute -top-10 ${isMine ? 'right-0' : 'left-0'} bg-white border border-surface-200 rounded-full px-2 py-1 flex gap-1 shadow-medium z-10 animate-fade-in`}>
                                {REACTIONS.map((emoji) => (
                                    <button
                                        key={emoji}
                                        onClick={() => { addReaction(message._id, emoji); setShowReactions(false); }}
                                        className="text-lg hover:scale-125 transition-transform"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {groupedReactions && Object.keys(groupedReactions).length > 0 && (
                        <div className={`flex gap-1 mt-1 flex-wrap ${isMine ? 'justify-end' : 'justify-start'}`}>
                            {Object.entries(groupedReactions).map(([emoji, count]) => (
                                <button
                                    key={emoji}
                                    onClick={() => addReaction(message._id, emoji)}
                                    className="flex items-center gap-0.5 bg-white border border-surface-200 rounded-full px-2 py-0.5 text-xs hover:border-primary-400 transition-colors shadow-soft"
                                >
                                    <span>{emoji}</span>
                                    {count > 1 && <span className="text-surface-500">{count}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;