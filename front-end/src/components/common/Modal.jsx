import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className={`bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-card w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-border dark:border-border-dark">
                    <h2 className="font-heading font-semibold text-text dark:text-text-dark">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-btn hover:bg-primary-light dark:hover:bg-primary/20 transition-colors"
                    >
                        <FiX size={20} className="text-text-secondary dark:text-text-secondary-dark" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;