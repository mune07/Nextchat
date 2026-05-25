import { useAuthStore } from '../store/useAuthStore.js';

const WelcomeScreen = () => {
    const { authUser } = useAuthStore();

    return (
        <div className="flex flex-col items-center justify-center h-full select-none relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #fef9ee 40%, #f0fdf4 100%)' }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 rounded-full blur-3xl opacity-40" style={{ background: 'radial-gradient(circle,#c7d2fe,transparent)' }} />
                <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: 'radial-gradient(circle,#ddd6fe,transparent)' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle,#a5b4fc,transparent)' }} />
            </div>

            <div className="relative z-10 text-center px-8 max-w-lg">
                <div className="relative inline-block mb-8">
                    <div className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 20px 60px rgba(99,102,241,0.4), 0 8px 20px rgba(99,102,241,0.2)' }}>
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-xl flex items-center justify-center" style={{ boxShadow: '0 4px 12px rgba(52,211,153,0.4)' }}>
                        <span className="text-white text-xs font-bold">✓</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-3" style={{ color: '#1e1b4b' }}>
                    Hey, {authUser?.fullName?.split(' ')[0]}! 👋
                </h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: '#64748b' }}>
                    Your conversations are waiting. Pick one from the sidebar or find someone new to chat with!
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: '⚡', label: 'Real-time', desc: 'Instant delivery', color: '#fef3c7', icon2: '🟡' },
                        { icon: '🔐', label: 'Encrypted', desc: 'JWT secured', color: '#dcfce7', icon2: '🟢' },
                        { icon: '👥', label: 'Groups', desc: 'Collaborate', color: '#ede9fe', icon2: '🟣' },
                    ].map((item) => (
                        <div key={item.label} className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 transition-transform hover:-translate-y-1" style={{ boxShadow: '0 4px 20px rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.08)' }}>
                            <span className="text-3xl">{item.icon}</span>
                            <span className="text-slate-800 text-sm font-bold">{item.label}</span>
                            <span className="text-slate-400 text-xs text-center">{item.desc}</span>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl text-left" style={{ background: 'white', border: '1px solid #e0e7ff', boxShadow: '0 4px 20px rgba(99,102,241,0.08)' }}>
                    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800">Start a conversation</p>
                        <p className="text-xs text-slate-400">Use the search bar on the left to find people by name or @username</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;