
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import type { Notification, NotificationType } from '../types';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const removeNotification = useCallback((id: number) => {
        setNotifications((prevNotifications) =>
            prevNotifications.filter((notification) => notification.id !== id)
        );
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Date.now();
        setNotifications((prevNotifications) => [...prevNotifications, { id, ...notification }]);

        setTimeout(() => {
            removeNotification(id);
        }, 5000); // Auto-dismiss after 5 seconds
    }, [removeNotification]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
