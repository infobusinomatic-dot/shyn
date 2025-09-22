import React, { useState, useEffect, useMemo } from 'react';
import type { User } from '../types';
import { getUsers, getAdminStats } from '../services/apiService';
import UserManagementTable from './UserManagementTable';
import { UsersIcon } from './icons/UsersIcon';
import StatCard from './StatCard';
import { UserCheckIcon } from './icons/UserCheckIcon';
import { ShieldAlertIcon } from './icons/ShieldAlertIcon';
import UserActivityAreaChart from './charts/UserActivityAreaChart';
import UserStatusPieChart from './charts/UserStatusPieChart';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
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

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState({ total: 0, active: 0, admins: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, statsData] = await Promise.all([
                    getUsers(),
                    getAdminStats()
                ]);
                setUsers(usersData);
                setStats(statsData);
            } catch (err) {
                setError("Failed to fetch admin data from the server.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUserUpdate = (updatedUsers: User[]) => {
        setUsers(updatedUsers);
    };

    if (loading) {
        return <div className="text-center p-8">Loading dashboard...</div>;
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
            >
                <div className="w-16 h-16 flex items-center justify-center bg-red-500/10 rounded-full mb-4">
                    <ShieldAlertIcon className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-base-100">Oops! Something went wrong.</h3>
                <p className="text-base-400 mt-2 max-w-sm">{error}</p>
            </motion.div>
        );
    }


    return (
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             transition={{ duration: 0.4, ease: 'easeInOut' }}
             className="h-full overflow-y-auto space-y-6"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
            >
                {/* FIX: Corrected a typo in the closing tag from </motion.div.div> to </motion.div> */}
                <motion.div variants={itemVariants} className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/20 rounded-lg">
                       <UsersIcon className="w-5 h-5 text-primary"/>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                </motion.div>

                {/* Stat Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                    <motion.div variants={itemVariants}><StatCard icon={UsersIcon} title="Total Users" value={stats.total} color="primary" /></motion.div>
                    <motion.div variants={itemVariants}><StatCard icon={UserCheckIcon} title="Active Users" value={stats.active} color="secondary" /></motion.div>
                    <motion.div variants={itemVariants}><StatCard icon={ShieldAlertIcon} title="Admins" value={stats.admins} color="yellow" /></motion.div>
                </motion.div>
                
                 {/* Charts */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xl:grid-cols-5 gap-6"
                >
                    <motion.div variants={itemVariants} className="xl:col-span-3 p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                         <h2 className="text-lg font-semibold text-white mb-4">New User Sign-ups (Last 7 Days)</h2>
                         <div className="h-72">
                            <UserActivityAreaChart />
                         </div>
                    </motion.div>
                     <motion.div variants={itemVariants} className="xl:col-span-2 p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                         <h2 className="text-lg font-semibold text-white mb-4">User Status Distribution</h2>
                         <div className="h-72">
                            <UserStatusPieChart users={users} />
                        </div>
                    </motion.div>
                </motion.div>


                {/* User Table */}
                <motion.div variants={itemVariants} className="h-[500px] flex flex-col gap-6 p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-white">User Management</h2>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <UserManagementTable initialUsers={users} onUsersChange={handleUserUpdate} />
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default AdminDashboard;