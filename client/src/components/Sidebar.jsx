import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useChatStore } from '../store/useChatStore.js';
import ConversationItem from './ConversationItem.jsx';
import NewGroupModal from './NewGroupModal.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
import { getConversationName, getConversationAvatar, getOtherMember } from '../utils/helpers.js';

const Sidebar = ({ onSelectConversation, activeConversationId }) => {
    const { authUser, logout } = useAuthStore();
    const {
        conversations, fetchConversations, isLoadingConversations,
        searchUsers, searchResults, isSearching, clearSearch,
        getOrCreatePrivateConversation, setActiveConversation, onlineUsers,
    } = useChatStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => { fetchConversations(); }, []);

    const handleSearch = (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        searchUsers(q);
    };

    const handleUserClick = async (user) => {
        const conv = await getOrCreatePrivateConversation(user._id);
        if (conv) {
            setActiveConversation(conv);
            onSelectConversation(conv);
            setSearchQuery('');
            clearSearch();
        }
    };

    return (
        <div className="flex flex-col h-full" style={{ background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 40%, #3730a3 100%)' }}>

            <div className="px-5 pt-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <span className="text-white text-lg font-bold tracking-wide">NexChat</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowGroupModal(true)}
                            title="New Group"
                            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
                            style={{ background: 'rgba(255,255,255,0.12)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        <div className="relative">
                            <button onClick={() => setShowMenu(!showMenu)} className="focus:outline-none">
                                <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white ring-opacity-30">
                                    {authUser?.profilePic ? (
                                        <img src={authUser.profilePic} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold" style={{ background: 'rgba(255,255,255,0.2)' }}>
                                            {authUser?.fullName?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </button>

                            {showMenu && (
                                <div className="absolute right-0 top-11 w-52 bg-white rounded-2xl shadow-2xl z-20 overflow-hidden animate-fade-in">
                                    <div className="p-4" style={{ background: 'linear-gradient(135deg,#eef2ff,#ede9fe)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                                                {authUser?.profilePic ? (
                                                    <img src={authUser.profilePic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                                                        {authUser?.fullName?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-slate-900 text-sm font-bold truncate">{authUser?.fullName}</p>
                                                <p className="text-slate-400 text-xs truncate">@{authUser?.username}</p>
                                                <span className="inline-flex items-center gap-1 mt-0.5">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                                    <span className="text-emerald-600 text-xs font-medium">Online</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <button onClick={() => { setShowProfile(true); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors text-sm font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                        <button onClick={() => { logout(); setShowMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search..."
                        className="w-full rounded-2xl pl-10 pr-8 py-2.5 text-sm focus:outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                        onFocus={e => e.target.style.background = 'rgba(255,255,255,0.18)'}
                        onBlur={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
                    />
                    {searchQuery && (
                        <button onClick={() => { setSearchQuery(''); clearSearch(); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-lg leading-none" style={{ color: 'rgba(255,255,255,0.6)' }}>×</button>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4" style={{ '--scrollbar-color': 'rgba(255,255,255,0.2)' }}>
                {searchQuery ? (
                    <div>
                        <p className="text-xs px-3 py-2 uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>People</p>
                        {isSearching ? (
                            <div className="flex justify-center py-6">
                                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.6)', borderTopColor: 'transparent' }}></div>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <p className="text-center py-6 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>No users found</p>
                        ) : (
                            searchResults.map((user) => {
                                const isOnline = onlineUsers.includes(user._id);
                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => handleUserClick(user)}
                                        className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer mb-1 transition-all"
                                        style={{ background: 'rgba(255,255,255,0.06)' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                    >
                                        <div className="relative flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full overflow-hidden ring-2" style={{ ringColor: 'rgba(255,255,255,0.2)' }}>
                                                {user.profilePic ? (
                                                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)' }}>
                                                        {user.fullName?.[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-800"></span>}
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">{user.fullName}</p>
                                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>@{user.username}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div>
                        <p className="text-xs px-3 py-2 uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>Messages</p>
                        {isLoadingConversations ? (
                            <div className="flex justify-center py-8">
                                <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(255,255,255,0.5)', borderTopColor: 'transparent' }}></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-14 px-4">
                                <div className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                    <svg className="w-8 h-8" style={{ color: 'rgba(255,255,255,0.4)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>No conversations yet</p>
                                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Search someone to start chatting</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <ConversationItem
                                    key={conv._id}
                                    conversation={conv}
                                    isActive={activeConversationId === conv._id}
                                    onClick={() => { setActiveConversation(conv); onSelectConversation(conv); }}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>

            {showGroupModal && <NewGroupModal onClose={() => setShowGroupModal(false)} onGroupCreated={(g) => { setActiveConversation(g); onSelectConversation(g); }} />}
            {showProfile && <ProfilePage onClose={() => setShowProfile(false)} />}
        </div>
    );
};

export default Sidebar;