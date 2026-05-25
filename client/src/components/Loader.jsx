const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen" style={{ background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)' }}>
            <div className="flex flex-col items-center gap-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-slate-800 font-bold text-lg">Nex<span className="text-brand-500">Chat</span></p>
                    <div className="flex items-center gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce-dot" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;