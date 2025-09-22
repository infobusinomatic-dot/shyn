

import React, { useState, useEffect } from 'react';
import type { ActivityLogEntry } from '../types';
// import { getActivityLog } from '../services/activityService'; // Removed mock service
import { CogIcon } from './icons/CogIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ActivityIcon } from './icons/ActivityIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { UsersIcon } from './icons/UsersIcon';
import { useSettings } from '../contexts/SettingsContext';
import { MusicIcon } from './icons/MusicIcon';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';
import { motion } from 'framer-motion';


const ActivityLog: React.FC = () => {
    // const [logs, setLogs] = useState<ActivityLogEntry[]>([]);

    // useEffect(() => {
    //     // In the future, this would fetch from an API endpoint
    //     // setLogs(getActivityLog());
    // }, []);

    const iconMap = {
        login: <UserCircleIcon className="w-5 h-5 text-green-400" />,
        update: <CogIcon className="w-5 h-5 text-blue-400" />,
        delete: <ShieldCheckIcon className="w-5 h-5 text-red-400" />,
        logout: <UserCircleIcon className="w-5 h-5 text-gray-400" />,
    };

    // Placeholder until backend endpoint is created
    return (
        <div className="text-center text-base-400 py-8">
            Activity log will be available soon.
        </div>
    );
}

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Settings: React.FC = () => {
    const { isAmbientSoundEnabled, toggleAmbientSound } = useSettings();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full overflow-y-auto p-4 flex justify-center"
        >
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl space-y-8"
            >

                {/* Account Management Section */}
                <motion.div variants={itemVariants} className="bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <CogIcon className="w-6 h-6 text-secondary" />
                        <h2 className="text-2xl font-bold text-white">Account Management</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Change Password</h3>
                                <p className="text-sm text-base-400">It's a good idea to use a strong password that you're not using elsewhere.</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-base-700 hover:bg-base-600 text-white transition">Change</button>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Two-Factor Authentication</h3>
                                <p className="text-sm text-base-400">Add an extra layer of security to your account.</p>
                            </div>
                             <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary-dark text-white transition">Enable</button>
                        </div>
                    </div>
                </motion.div>

                 {/* Audio Settings Section */}
                <motion.div variants={itemVariants} className="bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <MusicIcon className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold text-white">Audio Settings</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Ambient Background Sounds</h3>
                                <p className="text-sm text-base-400">Play subtle sounds that match SHYN's current mood.</p>
                            </div>
                            <button 
                                onClick={toggleAmbientSound}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isAmbientSoundEnabled ? 'bg-primary' : 'bg-base-700'}`}
                                aria-pressed={isAmbientSoundEnabled}
                            >
                                <span className="sr-only">Toggle Ambient Sounds</span>
                                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isAmbientSoundEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                {isAmbientSoundEnabled 
                                    ? <SoundOnIcon className="absolute left-1.5 w-3 h-3 text-white/80" />
                                    : <SoundOffIcon className="absolute right-1.5 w-3 h-3 text-white/80" />
                                }
                            </button>
                        </div>
                    </div>
                </motion.div>

                 {/* Connections Section */}
                <motion.div variants={itemVariants} className="bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UsersIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-2xl font-bold text-white">Connections</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Google Account</h3>
                                <p className="text-sm text-base-400">Connect to sync your calendar and contacts.</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-base-700 hover:bg-base-600 text-white transition">Connect</button>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Spotify</h3>
                                <p className="text-sm text-base-400">Share your favorite music and playlists.</p>
                            </div>
                             <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-600 text-white transition">Connected</button>
                        </div>
                    </div>
                </motion.div>


                {/* Privacy & Data Security Section */}
                <motion.div variants={itemVariants} className="bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-6">
                     <div className="flex items-center gap-3 mb-6">
                        <ShieldCheckIcon className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold text-white">Privacy & Data Security</h2>
                    </div>
                     <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg">
                            <div>
                                <h3 className="font-semibold text-base-100">Download Your Data</h3>
                                <p className="text-sm text-base-400">Get a copy of your data in a machine-readable format.</p>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-base-700 hover:bg-base-600 text-white transition">
                                <DownloadIcon className="w-4 h-4" />
                                Request Archive
                            </button>
                        </div>
                         <div className="flex justify-between items-center p-4 bg-base-800/70 rounded-lg border border-red-500/30">
                            <div>
                                <h3 className="font-semibold text-red-400">Delete Account</h3>
                                <p className="text-sm text-base-400">Permanently delete your account and all of your content.</p>
                            </div>
                             <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 hover:bg-red-700 text-white transition">Delete</button>
                        </div>
                    </div>
                </motion.div>

                {/* Activity Log Section */}
                <motion.div variants={itemVariants} className="bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-6">
                     <div className="flex items-center gap-3 mb-6">
                        <ActivityIcon className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-2xl font-bold text-white">Activity Log</h2>
                    </div>
                    <ActivityLog />
                </motion.div>

            </motion.div>
        </motion.div>
    );
};

export default Settings;