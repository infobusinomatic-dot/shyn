
import React from 'react';

interface StatCardProps {
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    title: string;
    value: number | string;
    color: 'primary' | 'secondary' | 'yellow';
}

const colorClasses = {
    primary: {
        bg: 'bg-primary/20',
        text: 'text-primary'
    },
    secondary: {
        bg: 'bg-secondary/20',
        text: 'text-secondary'
    },
    yellow: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400'
    }
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
    const classes = colorClasses[color];

    return (
        <div className="p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl flex items-center gap-5">
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${classes.bg}`}>
                <Icon className={`w-6 h-6 ${classes.text}`} />
            </div>
            <div>
                <p className="text-sm text-base-400 font-medium">{title}</p>
                <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
