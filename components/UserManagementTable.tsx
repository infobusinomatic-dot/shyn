


import React, { useState, useMemo, useEffect } from 'react';
import type { User, UserStatus } from '../types';
// import { deleteUser } from '../services/userService'; // This logic is now handled by parent component/API call
import { getStatusStyles } from '../utils/statusUtils';
import { UsersIcon } from './icons/UsersIcon';

interface UserManagementTableProps {
    initialUsers: User[];
    onUsersChange: (users: User[]) => void;
}

type SortKey = keyof User;

const UserManagementTable: React.FC<UserManagementTableProps> = ({ initialUsers, onUsersChange }) => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>(null);

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleDelete = (userId: number) => {
        // In a real app, you would make an API call to delete the user.
        // Here we simulate it and update the parent state.
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        onUsersChange(updatedUsers);
    };

    const sortedUsers = useMemo(() => {
        let sortableUsers = [...users];
        if (sortConfig !== null) {
            sortableUsers.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableUsers;
    }, [users, sortConfig]);

    const filteredUsers = useMemo(() => {
        return sortedUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [sortedUsers, searchTerm]);
    
    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full max-w-xs bg-base-800 border border-base-700 rounded-lg px-4 py-2 text-base-200 placeholder-base-600 focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="min-w-full divide-y divide-base-700/50">
                    <thead className="bg-base-800/50 sticky top-0">
                        <tr>
                            {['name', 'email', 'role', 'status'].map((key) => (
                                <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-base-400 uppercase tracking-wider">
                                     <button onClick={() => requestSort(key as SortKey)} className="flex items-center gap-2">
                                        {key}
                                        {sortConfig?.key === key && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-transparent divide-y divide-base-800/50">
                        {filteredUsers.map(user => {
                            const { dotClassName, textClassName } = getStatusStyles(user.status);
                            return (
                                <tr key={user.id} className="hover:bg-base-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 relative">
                                                <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="" />
                                                 <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ${dotClassName} ring-2 ring-base-900`}></span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-base-100">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-400">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-base-400 capitalize">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`h-2.5 w-2.5 rounded-full ${dotClassName} mr-2`}></div>
                                            <span className={`text-sm font-medium ${textClassName} capitalize`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button className="text-secondary hover:text-secondary-light transition">Edit</button>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-400 transition">Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {filteredUsers.length === 0 && (
                    <div className="text-center py-16 animate-fade-in">
                        <div className="w-16 h-16 flex items-center justify-center bg-base-800/50 rounded-full mx-auto mb-4">
                            <UsersIcon className="w-8 h-8 text-base-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-base-200">
                            {searchTerm ? 'No Users Found' : 'No Users to Display'}
                        </h3>
                        <p className="text-sm text-base-500 mt-1">
                            {searchTerm
                                ? 'Try adjusting your search query.'
                                : 'When new users sign up, they will appear here.'}
                        </p>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default UserManagementTable;