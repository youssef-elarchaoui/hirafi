import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useNotification from '../../hooks/useNotification';
import { FiBell } from 'react-icons/fi';

const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotification();

    useEffect(() => {
        // Fermer le dropdown quand on clique en dehors
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (id) => {
        await markAsRead(id);
        setIsOpen(false);
    };

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
            case 'withdrawal_approved':
                return '✅';
            case 'withdrawal_rejected':
                return '⚠️';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'order_completed':
            case 'payment_received':
            case 'withdrawal_approved':
                return 'text-success';
            case 'order_cancelled':
            case 'withdrawal_rejected':
                return 'text-error';
            case 'new_message':
                return 'text-primary';
            default:
                return 'text-warning';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours} h`;
        if (diffDays < 7) return `Il y a ${diffDays} j`;
        
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-btn hover:bg-primary-light dark:hover:bg-primary/20 transition-colors"
            >
                <FiBell className="w-5 h-5 text-text-secondary dark:text-text-secondary-dark" />
                
                {/* Badge de notification */}
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-bg dark:bg-bg-dark border border-border dark:border-border-dark rounded-card shadow-lg z-50 overflow-hidden animate-fade-in">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 border-b border-border dark:border-border-dark">
                        <h3 className="font-heading font-semibold text-text dark:text-text-dark">
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-caption text-primary hover:underline"
                            >
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    {/* Liste des notifications */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <div className="text-4xl mb-2">🔔</div>
                                <p className="text-text-secondary dark:text-text-secondary-dark text-sm">
                                    Aucune notification
                                </p>
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <Link
                                    key={notif._id}
                                    to={notif.link || '#'}
                                    onClick={() => handleNotificationClick(notif._id)}
                                    className={`
                                        flex items-start gap-3 px-4 py-3 border-b border-border dark:border-border-dark 
                                        hover:bg-primary-light dark:hover:bg-primary/10 transition-colors
                                        ${!notif.isRead ? 'bg-primary-light/30 dark:bg-primary/5' : ''}
                                    `}
                                >
                                    <div className="text-2xl">
                                        {getNotificationIcon(notif.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm ${!notif.isRead ? 'font-semibold' : ''} text-text dark:text-text-dark`}>
                                            {notif.title}
                                        </p>
                                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-0.5">
                                            {notif.message}
                                        </p>
                                        <p className="text-caption text-text-secondary dark:text-text-secondary-dark mt-1">
                                            {formatDate(notif.createdAt)}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    )}
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-border dark:border-border-dark text-center">
                            <Link
                                to="/notifications"
                                className="text-caption text-primary hover:underline"
                                onClick={() => setIsOpen(false)}
                            >
                                Voir toutes les notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;