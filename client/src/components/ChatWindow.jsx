import { useState, useEffect, useRef, useCallback } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import { useSocket } from '../context/SocketContext.jsx';
import { getConversationName, getConversationAvatar, getOtherMember, formatDate, convertToBase64 } from '../utils/helpers.js';
import MessageBubble from './MessageBubble.jsx';
import TypingIndicator from './TypingIndicator.jsx';

const ChatWindow = ({ conversation, isMobile }) => {
    const { authUser } = useAuthStore();
    const { messages, fetchMessages, sendMessage, markAsSeen, typingUsers, onlineUsers } = useChatStore();
    const { joinConversation, leaveConversation, emitTyping, emitStopTyping } = useSocket();

    const [text, setText] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const name = getConversationName(conversation, authUser);
    const avatar = getConversationAvatar(conversation, authUser);
    const otherMember = !conversation.isGroup ? getOtherMember(conversation, authUser) : null;
    const isOnline = otherMember ? onlineUsers.includes(otherMember._id) : false;
    const isTyping = (typingUsers[conversation._id] || []).length > 0;

    useEffect(() => {
        fetchMessages(conversation._id);
        joinConversation(conversation._id);
        markAsSeen(conversation._id);
        return () => leaveConversation(conversation._id);
    }, [conversation._id]);

    useEffect(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages, isTyping]);

    useEffect(() => {
        if (messages.length > 0) markAsSeen(conversation._id);
    }, [messages.length]);

    const handleTyping = useCallback((e) => {
        setText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height =
                Math.min(textareaRef.current.scrollHeight, 100) + 'px';
        }
        emitTyping(conversation._id, authUser._id);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(
            () => emitStopTyping(conversation._id, authUser._id),
            1500
        );
    }, [conversation._id, authUser._id]);

    const handleImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
        const base64 = await convertToBase64(file);
        setImageBase64(base64);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSend = async () => {
        if ((!text.trim() && !imageBase64) || isSending) return;
        setIsSending(true);
        emitStopTyping(conversation._id, authUser._id);
        await sendMessage({
            conversationId: conversation._id,
            text: text.trim(),
            image: imageBase64 || '',
        });
        setText('');
        setImagePreview(null);
        setImageBase64(null);
        setShowEmoji(false);
        setIsSending(false);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
            e.preventDefault();
            handleSend();
        }
    };

    const groupMessagesByDate = () => {
        const groups = [];
        let lastDate = null;
        messages.forEach((msg) => {
            const date = formatDate(msg.createdAt);
            if (date !== lastDate) {
                groups.push({ type: 'date', label: date });
                lastDate = date;
            }
            groups.push({ type: 'message', data: msg });
        });
        return groups;
    };

    return (
        <div
            className="flex flex-col"
            style={{
                height: '100%',
                background: 'linear-gradient(160deg, #fdf4ff 0%, #fef9ee 50%, #f0fdf4 100%)',
                overflow: 'hidden',
            }}
        >
            <div
                className="flex items-center justify-between bg-white flex-shrink-0"
                style={{
                    borderBottom: '1px solid #e8eaf6',
                    boxShadow: '0 2px 12px rgba(99,102,241,0.06)',
                    padding: isMobile ? '10px 16px 10px 56px' : '14px 24px',
                    minHeight: isMobile ? '60px' : '68px',
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div
                            className="rounded-full overflow-hidden"
                            style={{
                                width: isMobile ? '36px' : '42px',
                                height: isMobile ? '36px' : '42px',
                                border: '2px solid #e0e7ff',
                            }}
                        >
                            {avatar ? (
                                <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center text-white font-bold"
                                    style={{
                                        fontSize: isMobile ? '13px' : '15px',
                                        background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                                    }}
                                >
                                    {name?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                        {!conversation.isGroup && isOnline && (
                            <span
                                className="absolute bottom-0 right-0 bg-emerald-500 rounded-full border-2 border-white"
                                style={{ width: '10px', height: '10px' }}
                            ></span>
                        )}
                    </div>
                    <div>
                        <h3
                            className="font-bold text-slate-900 leading-tight truncate"
                            style={{
                                fontSize: isMobile ? '14px' : '15px',
                                maxWidth: isMobile ? '180px' : '300px',
                            }}
                        >
                            {name}
                        </h3>
                        <p className="text-xs">
                            {conversation.isGroup ? (
                                <span className="text-slate-400">{conversation.members.length} members</span>
                            ) : isOnline ? (
                                <span className="text-emerald-500 font-medium">● Active now</span>
                            ) : (
                                <span className="text-slate-400">Offline</span>
                            )}
                        </p>
                    </div>
                </div>

                {!isMobile && conversation.isGroup && (
                    <div className="flex -space-x-2">
                        {conversation.members.slice(0, 4).map((m) => (
                            <div
                                key={m._id}
                                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}
                            >
                                {m.fullName?.[0]}
                            </div>
                        ))}
                        {conversation.members.length > 4 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600 bg-indigo-50">
                                +{conversation.members.length - 4}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto"
                style={{
                    padding: isMobile ? '12px 12px 8px' : '20px 24px',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <div className="space-y-1">
                    {groupMessagesByDate().map((item, index) =>
                        item.type === 'date' ? (
                            <div key={`date-${index}`} className="flex items-center justify-center my-4">
                                <span
                                    className="text-xs text-slate-400 bg-white px-3 py-1.5 rounded-full font-medium"
                                    style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.06)', border: '1px solid #e8eaf6' }}
                                >
                                    {item.label}
                                </span>
                            </div>
                        ) : (
                            <MessageBubble
                                key={item.data._id}
                                message={item.data}
                                isGroup={conversation.isGroup}
                            />
                        )
                    )}
                    {isTyping && <TypingIndicator name={conversation.isGroup ? 'Someone' : name} />}
                    <div ref={messagesEndRef} style={{ height: '4px' }} />
                </div>
            </div>

            {imagePreview && (
                <div
                    className="bg-white flex-shrink-0"
                    style={{ borderTop: '1px solid #e8eaf6', padding: '8px 16px' }}
                >
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="preview"
                            style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #e0e7ff' }}
                        />
                        <button
                            onClick={() => { setImagePreview(null); setImageBase64(null); }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg"
                            style={{ width: '20px', height: '20px', fontSize: '12px' }}
                        >×</button>
                    </div>
                </div>
            )}

            {showEmoji && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: isMobile ? '65px' : '75px',
                        right: isMobile ? '8px' : '20px',
                        zIndex: 30,
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 12px 40px rgba(99,102,241,0.2)',
                    }}
                >
                    <EmojiPicker
                        onEmojiClick={(e) => {
                            setText((prev) => prev + e.emoji);
                            setShowEmoji(false);
                        }}
                        theme="light"
                        height={isMobile ? 280 : 360}
                        width={isMobile ? 270 : 320}
                    />
                </div>
            )}

            <div
                className="bg-white flex-shrink-0"
                style={{
                    borderTop: '1px solid #e8eaf6',
                    padding: isMobile ? '8px 12px' : '12px 20px',
                    paddingBottom: isMobile
                        ? 'max(8px, env(safe-area-inset-bottom))'
                        : '12px',
                }}
            >
                <div
                    className="flex items-end gap-2 rounded-2xl"
                    style={{
                        background: '#f4f6fb',
                        border: '1.5px solid #e0e7ff',
                        padding: isMobile ? '7px 10px' : '10px 14px',
                    }}
                >
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 flex items-center justify-center rounded-xl text-slate-400 active:scale-95 transition-all"
                        style={{
                            width: '34px',
                            height: '34px',
                            minWidth: '34px',
                            touchAction: 'manipulation',
                        }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />

                    <div className="flex-1 relative flex items-end min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleTyping}
                            onKeyDown={handleKeyDown}
                            placeholder="Write a message..."
                            rows={1}
                            className="w-full bg-transparent text-slate-800 placeholder-slate-400 resize-none focus:outline-none overflow-y-auto"
                            style={{
                                minHeight: '26px',
                                maxHeight: '100px',
                                fontSize: '15px',
                                lineHeight: '1.5',
                                fontFamily: 'Inter, sans-serif',
                                paddingRight: '28px',
                                WebkitAppearance: 'none',
                            }}
                        />
                        <button
                            onClick={() => setShowEmoji(!showEmoji)}
                            style={{
                                position: 'absolute',
                                right: '2px',
                                bottom: '0px',
                                fontSize: '18px',
                                touchAction: 'manipulation',
                                lineHeight: 1,
                            }}
                        >
                            😊
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={(!text.trim() && !imageBase64) || isSending}
                        className="flex-shrink-0 flex items-center justify-center rounded-xl text-white active:scale-95 transition-all disabled:opacity-40"
                        style={{
                            width: '34px',
                            height: '34px',
                            minWidth: '34px',
                            background: 'linear-gradient(135deg,#6366f1,#7c3aed)',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                            touchAction: 'manipulation',
                        }}
                    >
                        {isSending ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;