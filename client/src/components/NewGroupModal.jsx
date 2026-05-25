import { useState } from 'react';
import { useChatStore } from '../store/useChatStore.js';
import Avatar from './Avatar.jsx';
import axiosInstance from '../utils/axios.js';

const NewGroupModal = ({ onClose, onGroupCreated }) => {
    const { createGroupConversation } = useChatStore();
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);

    const handleSearch = async (q) => {
        setSearchQuery(q);
        if (!q.trim()) { setSearchResults([]); return; }
        try {
            const res = await axiosInstance.get(`/auth/search?query=${q}`);
            setSearchResults(res.data);
        } catch { setSearchResults([]); }
    };

    const toggleUser = (user) => {
        setSelectedUsers((prev) =>
            prev.find((u) => u._id === user._id)
                ? prev.filter((u) => u._id !== user._id)
                : [...prev, user]
        );
    };

    const handleCreate = async () => {
        if (!groupName.trim() || selectedUsers.length < 2) return;
        setIsCreating(true);
        const result = await createGroupConversation({ name: groupName, members: selectedUsers.map((u) => u._id) });
        setIsCreating(false);
        if (result) { onGroupCreated(result); onClose(); }
    };

    return (
        <div className="fixed inset-0 bg-surface-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-surface-200 rounded-2xl w-full max-w-md shadow-medium animate-slide-up">
                <div className="flex items-center justify-between p-5 border-b border-surface-100">
                    <h2 className="text-surface-900 font-semibold text-lg">Create Group</h2>
                    <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    <input type="text" placeholder="Group name" value={groupName} onChange={(e) => setGroupName(e.target.value)} className="input-field" />
                    <input type="text" placeholder="Search people to add..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="input-field" />

                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedUsers.map((user) => (
                                <div key={user._id} className="flex items-center gap-1 bg-primary-50 text-primary-600 border border-primary-200 rounded-full px-3 py-1 text-xs">
                                    <span>{user.fullName}</span>
                                    <button onClick={() => toggleUser(user)} className="hover:text-primary-800 ml-1 font-bold">×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {searchResults.length > 0 && (
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {searchResults.map((user) => {
                                const isSelected = selectedUsers.find((u) => u._id === user._id);
                                return (
                                    <div
                                        key={user._id}
                                        onClick={() => toggleUser(user)}
                                        className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-primary-50 border border-primary-100' : 'hover:bg-surface-50'}`}
                                    >
                                        <Avatar src={user.profilePic} name={user.fullName} size="sm" />
                                        <div>
                                            <p className="text-surface-800 text-sm font-medium">{user.fullName}</p>
                                            <p className="text-surface-400 text-xs">@{user.username}</p>
                                        </div>
                                        {isSelected && (
                                            <svg className="w-4 h-4 text-primary-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <p className="text-surface-400 text-xs">{selectedUsers.length} selected — need at least 2 members</p>

                    <button onClick={handleCreate} disabled={!groupName.trim() || selectedUsers.length < 2 || isCreating} className="btn-primary">
                        {isCreating ? 'Creating...' : 'Create Group'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewGroupModal;