import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ReactionType } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface ReactionAnimationProps {
    reaction: ReactionType;
    onComplete: () => void;
}

const ReactionAnimation: React.FC<ReactionAnimationProps> = ({ reaction, onComplete }) => {
    
    useEffect(() => {
        let timer: number;
        if (reaction === 'LAUGH' || reaction === 'CELEBRATE') {
            timer = window.setTimeout(() => {
                onComplete();
            }, 4000); // Max duration of child animations
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [reaction, onComplete]);

    const renderReaction = () => {
        switch (reaction) {
            case 'HEART':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 1.5] }}
                        transition={{ duration: 2, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
                        onAnimationComplete={onComplete}
                        className="flex items-center justify-center"
                    >
                        <HeartIcon className="w-48 h-48 text-primary/80" style={{ filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.7))' }}/>
                    </motion.div>
                );
            
            case 'LAUGH':
                return (
                    <motion.div
                        transition={{ staggerChildren: 0.1 }}
                        className="w-full h-full"
                        initial="initial"
                        animate="animate"
                    >
                        {Array.from({ length: 15 }).map((_, i) => (
                             <motion.span
                                key={i}
                                variants={{
                                    initial: { y: '110vh', opacity: 1, scale: 0.5 },
                                    animate: { y: '-10vh', opacity: 0, scale: 1 }
                                }}
                                transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }}
                                className="absolute text-5xl"
                                style={{
                                    left: `${Math.random() * 85}%`,
                                    transform: `rotate(${Math.random() * 60 - 30}deg)`
                                }}
                             >
                                😂
                             </motion.span>
                        ))}
                    </motion.div>
                );
            
            case 'SURPRISE':
                 return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.2 }}
                        animate={{ opacity: [0, 1, 1, 0], scale: [0.2, 1.3, 1, 0.5] }}
                        transition={{ duration: 1.5, ease: 'easeInOut', times: [0, 0.3, 0.8, 1] }}
                        onAnimationComplete={onComplete}
                    >
                        <span className="text-9xl" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>😮</span>
                    </motion.div>
                 );

            case 'CELEBRATE':
                return (
                     <motion.div className="w-full h-full" initial="initial" animate="animate">
                        {Array.from({ length: 50 }).map((_, i) => {
                             const colors = ['#8b5cf6', '#2dd4bf', '#f472b6', '#fbbf24'];
                             return (
                                <motion.div
                                    key={i}
                                    variants={{
                                        initial: { y: '-10vh', opacity: 1 },
                                        animate: { y: '110vh', opacity: [1, 1, 0] }
                                    }}
                                    transition={{ duration: 2 + Math.random() * 2, ease: 'linear' }}
                                    className="absolute"
                                    style={{
                                        left: `${Math.random() * 95}%`,
                                        width: `${Math.random() * 8 + 6}px`,
                                        height: `${Math.random() * 15 + 10}px`,
                                        backgroundColor: colors[i % colors.length],
                                        transform: `rotate(${Math.random() * 360}deg)`
                                    }}
                                />
                             );
                         })}
                    </motion.div>
                );

            default:
                onComplete();
                return null;
        }
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none overflow-hidden">
            {renderReaction()}
        </div>
    );
};

export default ReactionAnimation;