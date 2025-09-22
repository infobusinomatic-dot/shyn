
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { User, UserStatus } from '../../types';

interface UserStatusPieChartProps {
    users: User[];
}

const COLORS: { [key in UserStatus]: string } = {
    active: '#2dd4bf',  // secondary
    away: '#facc15',    // yellow-400
    inactive: '#64748b',// slate-500
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-base-800/80 backdrop-blur-md border border-base-700/50 rounded-lg shadow-lg">
        <p className="label text-sm text-base-100 font-bold">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};


const UserStatusPieChart: React.FC<UserStatusPieChartProps> = ({ users }) => {
    const data = useMemo(() => {
        const statusCounts = users.reduce((acc, user) => {
            acc[user.status] = (acc[user.status] || 0) + 1;
            return acc;
        }, {} as { [key in UserStatus]: number });

        return (Object.keys(statusCounts) as UserStatus[]).map(status => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: statusCounts[status],
        }));
    }, [users]);

    if (!users || users.length === 0) {
        return <div className="flex items-center justify-center h-full text-base-500">No user data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={5}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as UserStatus]} stroke={COLORS[entry.name.toLowerCase() as UserStatus]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default UserStatusPieChart;
