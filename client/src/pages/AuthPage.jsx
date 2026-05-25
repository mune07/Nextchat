import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore.js';

const AuthPage = () => {
    const { login, register, isLoading } = useAuthStore();
    const [isLogin, setIsLogin] = useState(true);
    const [showLP, setShowLP] = useState(false);
    const [showRP, setShowRP] = useState(false);
    const [pwStrength, setPwStrength] = useState(0);
    const [ld, setLd] = useState({ email: '', password: '' });
    const [rd, setRd] = useState({ fullName: '', username: '', email: '', password: '' });

    const calcStrength = (v) => {
        let s = 0;
        if (v.length >= 6) s++;
        if (/[A-Z]/.test(v)) s++;
        if (/[0-9]/.test(v)) s++;
        if (/[^A-Za-z0-9]/.test(v)) s++;
        setPwStrength(s);
    };

    const sBar = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
    const sLabel = ['Weak', 'Fair', 'Good', 'Strong'];

    const EyeOn = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const EyeOff = () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200 opacity-20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-200 opacity-20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-100 opacity-30 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-8 z-10">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <span className="text-2xl font-bold text-gray-900">Nex<span className="text-indigo-500">Chat</span></span>
            </div>

            <div className="w-full max-w-4xl z-10">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: '0 25px 60px rgba(99,102,241,0.15), 0 8px 25px rgba(0,0,0,0.06)' }}>
                    <div className="flex min-h-[540px]">

                        {isLogin ? (
                            <>
                                <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-12 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
                                    <p className="text-gray-400 text-sm mb-8">Sign in to continue chatting</p>

                                    <form onSubmit={async (e) => { e.preventDefault(); await login(ld); }} className="flex flex-col gap-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </span>
                                            <input type="email" value={ld.email} onChange={(e) => setLd({ ...ld, email: e.target.value })} placeholder="Email address" className="a-inp" required />
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </span>
                                            <input type={showLP ? 'text' : 'password'} value={ld.password} onChange={(e) => setLd({ ...ld, password: e.target.value })} placeholder="Password" className="a-inp" style={{ paddingRight: 40 }} required />
                                            <button type="button" onClick={() => setShowLP(!showLP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors">
                                                {showLP ? <EyeOff /> : <EyeOn />}
                                            </button>
                                        </div>

                                        <button type="submit" disabled={isLoading} className="a-btn mt-1">
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Signing in...
                                                </span>
                                            ) : 'Sign In'}
                                        </button>
                                    </form>

                                    <p className="text-center text-gray-400 text-xs mt-6 md:hidden">
                                        No account? <button onClick={() => setIsLogin(false)} className="text-indigo-500 font-semibold">Sign up</button>
                                    </p>
                                </div>

                                <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center p-12 text-white rounded-r-3xl animate-fade-in" style={{ background: 'linear-gradient(145deg, #6366f1 0%, #7c3aed 60%, #a78bfa 100%)' }}>
                                    <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center mb-6">
                                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Hello, Friend!</h3>
                                    <p className="text-sm opacity-80 leading-relaxed mb-6 max-w-xs">
                                        New here? Create an account and start chatting with people in real-time for free.
                                    </p>
                                    <div className="flex flex-col gap-2 w-full max-w-xs mb-6">
                                        {['⚡ Real-time messaging', '🔒 Secure & private', '👥 Group chats', '😊 Reactions & emoji'].map((f) => (
                                            <div key={f} className="flex items-center gap-2 bg-white bg-opacity-15 rounded-xl px-4 py-2 text-sm font-medium">{f}</div>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsLogin(false)} className="auth-overlay-btn">Sign Up Free</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="hidden md:flex w-1/2 flex-col items-center justify-center text-center p-12 text-white rounded-l-3xl animate-fade-in" style={{ background: 'linear-gradient(145deg, #6366f1 0%, #7c3aed 60%, #a78bfa 100%)' }}>
                                    <div className="w-16 h-16 rounded-2xl bg-white bg-opacity-20 flex items-center justify-center mb-6">
                                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">Welcome Back!</h3>
                                    <p className="text-sm opacity-80 leading-relaxed mb-6 max-w-xs">
                                        Already have an account? Sign in to continue your conversations where you left off.
                                    </p>
                                    <div className="flex flex-col gap-2 w-full max-w-xs mb-6">
                                        {['💬 Private chats', '👥 Group rooms', '📷 Image sharing', '✅ Read receipts'].map((f) => (
                                            <div key={f} className="flex items-center gap-2 bg-white bg-opacity-15 rounded-xl px-4 py-2 text-sm font-medium">{f}</div>
                                        ))}
                                    </div>
                                    <button onClick={() => setIsLogin(true)} className="auth-overlay-btn">Sign In</button>
                                </div>

                                <div className="w-full md:w-1/2 flex flex-col justify-center px-10 py-10 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
                                    <p className="text-gray-400 text-sm mb-6">Join NexChat today — it's free</p>

                                    <form onSubmit={async (e) => { e.preventDefault(); await register(rd); }} className="flex flex-col gap-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </span>
                                                <input type="text" value={rd.fullName} onChange={(e) => setRd({ ...rd, fullName: e.target.value })} placeholder="Full name" className="a-inp text-sm" required />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm font-semibold">@</span>
                                                <input type="text" value={rd.username} onChange={(e) => setRd({ ...rd, username: e.target.value })} placeholder="Username" className="a-inp text-sm" required />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                </svg>
                                            </span>
                                            <input type="email" value={rd.email} onChange={(e) => setRd({ ...rd, email: e.target.value })} placeholder="Email address" className="a-inp" required />
                                        </div>

                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </span>
                                            <input type={showRP ? 'text' : 'password'} value={rd.password} onChange={(e) => { setRd({ ...rd, password: e.target.value }); calcStrength(e.target.value); }} placeholder="Password (min. 6 chars)" className="a-inp" style={{ paddingRight: 40 }} required />
                                            <button type="button" onClick={() => setShowRP(!showRP)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors">
                                                {showRP ? <EyeOff /> : <EyeOn />}
                                            </button>
                                        </div>

                                        {rd.password.length > 0 && (
                                            <div>
                                                <div className="flex gap-1 mb-1">
                                                    {[0, 1, 2, 3].map((i) => (
                                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < pwStrength ? sBar[pwStrength - 1] : 'bg-gray-200'}`} />
                                                    ))}
                                                </div>
                                                {pwStrength > 0 && <p className="text-xs text-gray-400">Strength: <span className="font-medium text-gray-600">{sLabel[pwStrength - 1]}</span></p>}
                                            </div>
                                        )}

                                        <button type="submit" disabled={isLoading} className="a-btn mt-1">
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Creating...
                                                </span>
                                            ) : 'Create Account'}
                                        </button>
                                    </form>

                                    <p className="text-center text-gray-400 text-xs mt-5 md:hidden">
                                        Have an account? <button onClick={() => setIsLogin(true)} className="text-indigo-500 font-semibold">Sign in</button>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <p className="text-gray-400 text-xs mt-6 z-10">© 2025 NexChat — Real-time messaging</p>
        </div>
    );
};

export default AuthPage;