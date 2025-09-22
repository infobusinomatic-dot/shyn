
import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from './icons/HeartIcon';

interface LoadingIndicatorProps {
    message: string;
}

// FIX: Refactored to a plain function to avoid React.FC type conflicts with framer-motion props.
const LoadingIndicator = ({ message }: LoadingIndicatorProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-lg text-base-300 gap-4">
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                <HeartIcon className="w-12 h-12 text-primary" />
            </motion.div>
            <p>{message}</p>
        </div>
    );
};

export default LoadingIndicator;
