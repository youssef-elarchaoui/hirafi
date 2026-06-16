import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../api/notificationApi';
import useSocket from './useSocket';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

/**
 * Hook personnalisé pour la gestion des notifications
 */
const useNotification = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    const { socket, onEvent } = useSocket();
    const { user } = useAuth();

    const fetchNotifications = useCallback(async (reset = false) => {
        if (loading) return;
        
        const currentPage = reset ? 1 : page;
        setLoading(true);
        
        try {
            const response = await notificationApi.getNotifications(currentPage, 20);
            const newNotifications = response.data.notifications;
            const newUnreadCount = response.data.unreadCount;
            
            setUnreadCount(newUnreadCount);
            
            if (reset) {
                setNotifications(newNotifications);
                setPage(1);
                setHasMore(newNotifications.length === 20);
            } else {
                setNotifications(prev => [...prev, ...newNotifications]);
                setHasMore(newNotifications.length === 20);
            }
            
            setPage(currentPage + 1);
        } catch (error) {
            console.error('Erreur fetchNotifications:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading]);

    const markAsRead = useCallback(async (id) => {
        try {
            await notificationApi.markAsRead(id);
            
            setNotifications(prev =>
                prev.map(notif =>
                    notif._id === id ? { ...notif, isRead: true } : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erreur markAsRead:', error);
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
            toast.success('Toutes les notifications ont été marquées comme lues');
        } catch (error) {
            console.error('Erreur markAllAsRead:', error);
        }
    }, []);

    const deleteNotification = useCallback(async (id) => {
        try {
            await notificationApi.deleteNotification(id);
            setNotifications(prev => prev.filter(notif => notif._id !== id));
            
            const deletedNotif = notifications.find(n => n._id === id);
            if (deletedNotif && !deletedNotif.isRead) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
            
            toast.success('Notification supprimée');
        } catch (error) {
            console.error('Erreur deleteNotification:', error);
        }
    }, [notifications]);

    // Écouter les notifications en temps réel
    useEffect(() => {
        if (!socket || !user) return;

        const unsubscribe = onEvent('new_notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Afficher un toast simple
            toast.success(notification.message, {
                duration: 5000,
                icon: '🔔'
            });
        });

        return unsubscribe;
    }, [socket, user, onEvent]);

    // Charger les notifications initiales
    useEffect(() => {
        if (user) {
            fetchNotifications(true);
        }
    }, [user]);

    return {
        notifications,
        unreadCount,
        loading,
        hasMore,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    };
};

export default useNotification; 