
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getUserActivity } from '../../services/apiService';
import type { AnalyticsDataPoint } from '../../types';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-base-800/80 backdrop-blur-md border border-base-700/50 rounded-lg shadow-lg">
        <p className="label text-sm text-base-300">{`${label}`}</p>
        <p className="intro text-base-100 font-bold">{`${payload[0].value} new users`}</p>
      </div>
    );
  }
  return null;
};

const UserActivityAreaChart: React.FC = () => {
    const [data, setData] = useState<AnalyticsDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const activityData = await getUserActivity();
                setData(activityData);
            } catch (error) {
                console.error("Failed to fetch user activity:", error);
                // Optionally set an error state to display in the UI
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-base-400">Loading chart data...</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUsers)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default UserActivityAreaChart;
