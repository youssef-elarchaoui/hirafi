import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', type = 'danger' }) => {
    if (!isOpen) return null;

    const typeColors = {
        danger: {
            bg: 'bg-error/10',
            border: 'border-error/30',
            text: 'text-error',
            button: 'btn-danger'
        },
        warning: {
            bg: 'bg-warning/10',
            border: 'border-warning/30',
            text: 'text-warning',
            button: 'btn-warning'
        },
        info: {
            bg: 'bg-primary/10',
            border: 'border-primary/30',
            text: 'text-primary',
            button: 'btn-primary'
        }
    };

    const colors = typeColors[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-card max-w-md w-full">
                <div className={`flex items-center gap-3 p-4 border-b ${colors.bg} ${colors.border}`}>
                    <FiAlertTriangle className={colors.text} size={24} />
                    <h2 className="font-heading font-semibold text-text dark:text-text-dark">
                        {title}
                    </h2>
                </div>

                <div className="p-4">
                    <p className="text-text-secondary dark:text-text-secondary-dark">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-border dark:border-border-dark">
                    <button onClick={onClose} className="btn btn-secondary text-sm">
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} className={`btn ${colors.button} text-sm`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;