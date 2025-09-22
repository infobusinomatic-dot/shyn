
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { Page, User } from './types';
import { getMe } from './services/apiService';

import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import { SettingsProvider } from './contexts/SettingsContext';

import Header from './components/Header';
import ChatView from './components/ChatView';
import UserProfile from './components/UserProfile';
import Settings from './components/Settings';
import AdminDashboard from './components/AdminDashboard';
import NotificationToast from './components/NotificationToast';
import LoadingIndicator from './components/LoadingIndicator';

// FIX: Refactored to a plain function to avoid React.FC type conflicts with framer-motion props.
const AppContent = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Chat');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [appBackgroundUrl, setAppBackgroundUrl] = useState<string | null>(null);
    const { addNotification } = useNotifications();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getMe();
                setCurrentUser(user);
                addNotification({ message: `Welcome back, ${user.name}!`, type: 'info' });
            } catch (err) {
                setError("Could not connect to the backend. Please ensure the server is running and refresh the page.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [addNotification]);
    
    const handleAvatarUpdate = useCallback((url: string | null) => {
        setAppBackgroundUrl(url);
    }, []);

    const pageContent = useMemo(() => {
        if (isLoading) {
            return <LoadingIndicator message="Connecting to server..." />;
        }
        if (error) {
             return <div className="flex items-center justify-center h-full text-lg text-red-400"><p>{error}</p></div>;
        }
        if (!currentUser) {
            return <div className="flex items-center justify-center h-full"><p>Could not load user data.</p></div>;
        }

        switch (currentPage) {
            case 'Profile':
                return <UserProfile user={currentUser} />;
            case 'Settings':
                return <Settings />;
            case 'Admin':
                return currentUser.role === 'admin' ? <AdminDashboard /> : <ChatView user={currentUser} onAvatarUpdate={handleAvatarUpdate} />;
            case 'Chat':
            default:
                return <ChatView user={currentUser} onAvatarUpdate={handleAvatarUpdate} />;
        }
    }, [currentPage, currentUser, error, handleAvatarUpdate, isLoading]);

    return (
        <div className="relative min-h-screen w-full bg-base-900 overflow-hidden">
             <AnimatePresence>
                {appBackgroundUrl && (
                    <motion.div
                        key={appBackgroundUrl}
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.0, ease: 'easeInOut' }}
                        style={{
                            backgroundImage: `url(${appBackgroundUrl})`,
                            filter: 'blur(16px) brightness(0.4)',
                            transform: 'scale(1.1)',
                        }}
                    />
                )}
            </AnimatePresence>
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-br from-primary/30 via-secondary/20 to-base-900 bg-[length:200%_200%] animate-mesh-gradient"></div>

            <div className="relative z-10 flex flex-col h-screen p-4 md:p-6 lg:p-8">
                {currentUser && <Header user={currentUser} onNavigate={setCurrentPage} currentPage={currentPage} />}
                <main className="flex-1 mt-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                         {React.cloneElement(pageContent, { key: currentPage })}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const App = () => {
    return (
        <NotificationProvider>
            <SettingsProvider>
                <AppContent />
                <NotificationToast />
            </SettingsProvider>
        </NotificationProvider>
    )
}

export default App;
