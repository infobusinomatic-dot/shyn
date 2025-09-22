import type { UserStatus } from '../types';

interface StatusStyles {
    dotClassName: string;
    textClassName: string;
}

const statusStylesConfig: { [key in UserStatus]: StatusStyles } = {
    active: { dotClassName: 'bg-secondary', textClassName: 'text-secondary-light' },
    away: { dotClassName: 'bg-yellow-500', textClassName: 'text-yellow-300' },
    inactive: { dotClassName: 'bg-gray-500', textClassName: 'text-gray-400' },
};

export const getStatusStyles = (status: UserStatus): StatusStyles => {
    return statusStylesConfig[status] || statusStylesConfig.inactive;
};