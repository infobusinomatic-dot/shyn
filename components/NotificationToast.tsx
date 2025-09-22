
import React, { useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { XIcon } from './icons/XIcon';
import { BellIcon } from './icons/BellIcon'; // A generic icon

const NotificationToast: React.FC = () => {
    const { notifications, removeNotification } = useNotifications();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div
            aria-live="assertive"
            className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
        >
            <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl bg-base-800/80 backdrop-blur-lg shadow-2xl shadow-black/20 ring-1 ring-base-700/50 animate-fade-in-up"
                    >
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                   <BellIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-base-100">{notification.message}</p>
                                </div>
                                <div className="ml-4 flex flex-shrink-0">
                                    <button
                                        type="button"
                                        className="inline-flex rounded-md bg-transparent text-base-400 hover:text-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                                        onClick={() => removeNotification(notification.id)}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationToast;