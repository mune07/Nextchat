import { getAvatarFallback } from '../utils/helpers.js';

const Avatar = ({ src, name, size = 'md', isOnline = false }) => {
    const sizes = {
        xs: 'w-7 h-7 text-xs',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
        xl: 'w-16 h-16 text-xl',
    };
    const dotSizes = {
        xs: 'w-2 h-2', sm: 'w-2 h-2',
        md: 'w-3 h-3', lg: 'w-3.5 h-3.5', xl: 'w-4 h-4',
    };

    return (
        <div className="relative flex-shrink-0">
            {src ? (
                <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} style={{ border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} />
            ) : (
                <div className={`${sizes[size]} rounded-full flex items-center justify-center`} style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', border: '2px solid white', boxShadow: '0 1px 4px rgba(99,102,241,0.2)' }}>
                    <span className="text-white font-bold">{getAvatarFallback(name)}</span>
                </div>
            )}
            {isOnline && (
                <span className={`absolute bottom-0 right-0 ${dotSizes[size]} bg-emerald-500 rounded-full`} style={{ border: '2px solid white' }}></span>
            )}
        </div>
    );
};

export default Avatar;