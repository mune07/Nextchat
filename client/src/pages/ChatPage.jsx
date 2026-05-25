import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import WelcomeScreen from '../components/WelcomeScreen.jsx';

const ChatPage = () => {
    const [activeConversation, setActiveConversation] = useState(null);
    const [showSidebar, setShowSidebar] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setViewportHeight(window.innerHeight);
        };

        const handleVisualViewport = () => {
            if (window.visualViewport) {
                setViewportHeight(window.visualViewport.height);
            }
        };

        window.addEventListener('resize', handleResize);
        window.visualViewport?.addEventListener('resize', handleVisualViewport);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.visualViewport?.removeEventListener('resize', handleVisualViewport);
        };
    }, []);

    const handleSelectConversation = (conversation) => {
        setActiveConversation(conversation);
        if (isMobile) setShowSidebar(false);
    };

    const handleBack = () => {
        setShowSidebar(true);
        if (isMobile) setActiveConversation(null);
    };

    return (
        <div
            className="flex overflow-hidden"
            style={{
                height: `${viewportHeight}px`,
                background: '#1e1b4b',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}
        >
            <div
                className="flex-col h-full flex-shrink-0"
                style={{
                    display: isMobile ? (showSidebar ? 'flex' : 'none') : 'flex',
                    width: isMobile ? '100%' : '320px',
                    boxShadow: '4px 0 20px rgba(30,27,75,0.3)',
                }}
            >
                <Sidebar
                    onSelectConversation={handleSelectConversation}
                    activeConversationId={activeConversation?._id}
                />
            </div>

            <div
                className="flex-col flex-1 min-w-0 h-full"
                style={{
                    display: isMobile ? (!showSidebar ? 'flex' : 'none') : 'flex',
                }}
            >
                {activeConversation ? (
                    <div className="flex flex-col h-full relative">
                        {isMobile && (
                            <button
                                onClick={handleBack}
                                className="absolute z-20 flex items-center justify-center rounded-xl bg-white text-slate-600 active:scale-95 transition-all"
                                style={{
                                    top: '12px',
                                    left: '12px',
                                    width: '36px',
                                    height: '36px',
                                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                                    touchAction: 'manipulation',
                                }}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                        )}
                        <ChatWindow
                            conversation={activeConversation}
                            isMobile={isMobile}
                            viewportHeight={viewportHeight}
                        />
                    </div>
                ) : (
                    <WelcomeScreen />
                )}
            </div>
        </div>
    );
};

export default ChatPage;