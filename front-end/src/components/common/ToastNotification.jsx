import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

const ToastNotification = ({ type, message, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: <FiCheckCircle className="text-success" size={20} />,
        error: <FiXCircle className="text-error" size={20} />,
        warning: <FiAlertCircle className="text-warning" size={20} />,
        info: <FiInfo className="text-primary" size={20} />
    };

    const bgColors = {
        success: 'bg-success/10 border-success/30',
        error: 'bg-error/10 border-error/30',
        warning: 'bg-warning/10 border-warning/30',
        info: 'bg-primary/10 border-primary/30'
    };

    const textColors = {
        success: 'text-success',
        error: 'text-error',
        warning: 'text-warning',
        info: 'text-primary'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-btn border ${bgColors[type]} animate-slide-in`}>
            {icons[type]}
            <p className={`text-sm ${textColors[type]}`}>{message}</p>
            <button onClick={onClose} className="text-text-secondary hover:text-text">
                <FiX size={16} />
            </button>
        </div>
    );
};

export default ToastNotification;