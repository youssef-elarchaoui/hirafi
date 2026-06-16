import { Link } from 'react-router-dom';
import useNotification from '../../hooks/useNotification';
import LoadingSpinner from '../common/LoadingSpinner';

const NotificationList = () => {
    const { notifications, loading, hasMore, fetchNotifications, markAsRead } = useNotification();

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order_created':
            case 'order_accepted':
            case 'order_delivered':
            case 'order_completed':
                return '📦';
            case 'order_cancelled':
                return '❌';
            case 'new_message':
                return '💬';
            case 'new_review':
                return '⭐';
            case 'payment_received':
                return '💰';
            default:
                return '🔔';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / 86400000);

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        
        return date.toLocaleDateString('fr-FR');
    };

    if (loading && notifications.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-h1 mb-6">Notifications</h1>
            
            {notifications.length === 0 ? (
                <div className="bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-card p-8 text-center">
                    <div className="text-6xl mb-4">🔔</div>
                    <p className="text-text-secondary dark:text-text-secondary-dark">
                        Aucune notification pour le moment
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notif) => (
                        <Link
                            key={notif._id}
                            to={notif.link || '#'}
                            onClick={() => markAsRead(notif._id)}
                            className={`
                                flex items-start gap-4 p-4 bg-bg dark:bg-bg-dark 
                                border border-border dark:border-border-dark rounded-card
                                hover:border-primary transition-all
                                ${!notif.isRead ? 'border-l-3 border-l-primary' : ''}
                            `}
                        >
                            <div className="text-3xl">
                                {getNotificationIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <p className={`text-text dark:text-text-dark ${!notif.isRead ? 'font-semibold' : ''}`}>
                                    {notif.title}
                                </p>
                                <p className="text-text-secondary dark:text-text-secondary-dark text-sm mt-1">
                                    {notif.message}
                                </p>
                                <p className="text-caption text-text-secondary dark:text-text-secondary-dark mt-2">
                                    {formatDate(notif.createdAt)}
                                </p>
                            </div>
                            {!notif.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                            )}
                        </Link>
                    ))}
                    
                    {hasMore && (
                        <div className="text-center pt-4">
                            <button
                                onClick={() => fetchNotifications()}
                                className="btn btn-secondary text-sm"
                                disabled={loading}
                            >
                                {loading ? 'Chargement...' : 'Charger plus'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationList;