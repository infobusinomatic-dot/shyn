

import React, { useState } from 'react';
import type { User } from '../types';
import { getStatusStyles } from '../utils/statusUtils';
import { motion } from 'framer-motion';

interface UserProfileProps {
    user: User;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isEditing, setIsEditing] = useState(false);
    const { dotClassName } = getStatusStyles(user.status);

    const handleSave = () => {
        // In a real app, you would call an API to save the changes
        console.log("Saving user profile:", { ...user, name, email });
        setIsEditing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full flex items-center justify-center p-4"
        >
            <div className="w-full max-w-2xl bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl p-8">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative flex-shrink-0">
                            <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/30" />
                            <span className={`absolute bottom-1 right-1 block h-4 w-4 rounded-full ${dotClassName} border-2 border-base-900`}></span>
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                            <p className="text-base-400">{user.email}</p>
                            <span className="mt-2 inline-block rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary-light capitalize">{user.role}</span>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-8 border-t border-base-700 pt-8">
                        <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-base-300">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full bg-base-800 border border-base-700 rounded-lg px-4 py-2.5 text-base-200 placeholder-base-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-base-300">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={!isEditing}
                                        className="mt-1 block w-full bg-base-800 border border-base-700 rounded-lg px-4 py-2.5 text-base-200 placeholder-base-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end gap-4">
                                {isEditing ? (
                                    <>
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-base-700 hover:bg-base-600 text-white transition">Cancel</button>
                                        <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary hover:bg-primary-dark text-white transition">Save Changes</button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-secondary hover:bg-secondary-dark text-white transition">Edit Profile</button>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default UserProfile;