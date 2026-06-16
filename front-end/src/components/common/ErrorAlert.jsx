import { FiAlertCircle, FiX } from 'react-icons/fi';

const ErrorAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="bg-error/10 border border-error/30 rounded-btn p-4 mb-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
                <FiAlertCircle className="text-error mt-0.5 flex-shrink-0" />
                <p className="text-error text-sm">{message}</p>
            </div>
            {onClose && (
                <button onClick={onClose} className="text-error hover:text-error/80">
                    <FiX size={16} />
                </button>
            )}
        </div>
    );
};

export default ErrorAlert;