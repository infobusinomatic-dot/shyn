
import React, { useState, useRef, useEffect } from 'react';

import type { Page, User } from '../types';
import { getStatusStyles } from '../utils/statusUtils';

import { HeartIcon } from './icons/HeartIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CogIcon } from './icons/CogIcon';
import { LayoutDashboardIcon } from './icons/LayoutDashboardIcon';
import { BellIcon } from './icons/BellIcon';

interface HeaderProps {
    user: User;
    onNavigate: (page: Page) => void;
    currentPage: Page;
}

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const Header = ({ user, onNavigate, currentPage }: HeaderProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { dotClassName } = getStatusStyles(user.status);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const handleNavigation = (page: Page) => {
        onNavigate(page);
        setIsDropdownOpen(false);
    }

    return (
        <header className="flex-shrink-0 animate-fade-in">
            <div className="flex items-center justify-between p-4 bg-base-900/50 backdrop-blur-xl border border-base-700/50 rounded-2xl">
                <button onClick={() => handleNavigation('Chat')} className="flex items-center gap-3">
                    <HeartIcon className="w-7 h-7 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold text-base-100 tracking-tight">
                        SHYN
                    </h1>
                </button>
                 <div className="flex items-center gap-4">
                     <button className="relative text-base-400 hover:text-white transition-colors duration-200">
                        <BellIcon className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                     </button>
                    <div className="relative" ref={dropdownRef}>
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                            className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-900"
                            aria-haspopup="true"
                            aria-expanded={isDropdownOpen}
                            aria-label="User menu"
                        >
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover bg-base-950" />
                            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${dotClassName} border-2 border-base-900`}></span>
                        </button>
                        
                        {isDropdownOpen && (
                             <div className="absolute right-0 mt-2 w-56 origin-top-right bg-base-800/80 backdrop-blur-lg border border-base-700/50 rounded-xl shadow-2xl shadow-black/20 ring-1 ring-black ring-opacity-5 focus:outline-none animate-fade-in" style={{animationDuration: '150ms'}}>
                                <div className="py-2 px-2">
                                    <div className="px-3 py-2 border-b border-base-700/50 mb-2">
                                        <p className="text-sm font-semibold text-base-100 truncate">{user.name}</p>
                                        <p className="text-xs text-base-400 truncate">{user.email}</p>
                                    </div>
                                    <a onClick={() => handleNavigation('Profile')} className="flex items-center gap-3 px-3 py-2 text-sm text-base-300 rounded-md hover:bg-base-700/50 hover:text-white transition-colors duration-150 cursor-pointer">
                                        <UserCircleIcon className="w-5 h-5" />
                                        <span>My Profile</span>
                                    </a>
                                    <a onClick={() => handleNavigation('Settings')} className="flex items-center gap-3 px-3 py-2 text-sm text-base-300 rounded-md hover:bg-base-700/50 hover:text-white transition-colors duration-150 cursor-pointer">
                                        <CogIcon className="w-5 h-5" />
                                        <span>Settings</span>
                                    </a>
                                    {user.role === 'admin' && (
                                        <a onClick={() => handleNavigation('Admin')} className="flex items-center gap-3 px-3 py-2 text-sm text-base-300 rounded-md hover:bg-base-700/50 hover:text-white transition-colors duration-150 cursor-pointer">
                                            <LayoutDashboardIcon className="w-5 h-5" />
                                            <span>Admin Dashboard</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                     </div>
                 </div>
            </div>
        </header>
    );
};

export default Header;
