const TypingIndicator = ({ name }) => {
    return (
        <div className="flex items-end gap-2 mb-2">
            <div className="bg-white border border-surface-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-primary-400 rounded-full animate-bounce-dot"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
            {name && <span className="text-xs text-surface-400 mb-1">{name} is typing...</span>}
        </div>
    );
};

export default TypingIndicator;