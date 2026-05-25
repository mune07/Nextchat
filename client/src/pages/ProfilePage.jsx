import { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';
import { convertToBase64 } from '../utils/helpers.js';
import Avatar from '../components/Avatar.jsx';

const ProfilePage = ({ onClose }) => {
    const { authUser, updateProfile, isLoading } = useAuthStore();
    const [fullName, setFullName] = useState(authUser?.fullName || '');
    const [bio, setBio] = useState(authUser?.bio || '');
    const [previewPic, setPreviewPic] = useState(authUser?.profilePic || '');
    const [base64Pic, setBase64Pic] = useState('');
    const fileRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return; }
        const base64 = await convertToBase64(file);
        setBase64Pic(base64);
        setPreviewPic(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        const data = { fullName, bio };
        if (base64Pic) data.profilePic = base64Pic;
        const success = await updateProfile(data);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-surface-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border border-surface-200 rounded-2xl w-full max-w-md shadow-medium animate-slide-up">
                <div className="flex items-center justify-between p-5 border-b border-surface-100">
                    <h2 className="text-surface-900 font-semibold text-lg">Edit Profile</h2>
                    <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <Avatar src={previewPic} name={authUser?.fullName} size="xl" />
                            <button
                                onClick={() => fileRef.current?.click()}
                                className="absolute bottom-0 right-0 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors shadow-medium"
                            >
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                        <div className="text-center">
                            <p className="text-surface-900 font-semibold">{authUser?.fullName}</p>
                            <p className="text-surface-400 text-sm">@{authUser?.username}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Full Name</label>
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Your full name" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-surface-700 mb-2">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field resize-none" rows={3} maxLength={150} placeholder="Tell people about yourself..." />
                        <p className="text-surface-400 text-xs mt-1 text-right">{bio.length}/150</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface-50 rounded-xl p-3 text-center border border-surface-100">
                            <p className="text-surface-400 text-xs">Email</p>
                            <p className="text-surface-800 text-sm font-medium truncate">{authUser?.email}</p>
                        </div>
                        <div className="bg-surface-50 rounded-xl p-3 text-center border border-surface-100">
                            <p className="text-surface-400 text-xs">Member since</p>
                            <p className="text-surface-800 text-sm font-medium">
                                {new Date(authUser?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    </div>

                    <button onClick={handleSave} disabled={isLoading} className="btn-primary">
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;