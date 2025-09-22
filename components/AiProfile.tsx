
import React, { useRef, useState, useEffect } from 'react';
// FIX: Changed import for Variants to be a type import to resolve module export error.
import { motion, type Variants } from 'framer-motion';

import type { Mood, AppearanceName, AvatarCustomization } from '../types';
import { useNotifications } from '../contexts/NotificationContext';
import { generateAvatar } from '../services/geminiService';

import FeatureCard from './FeatureCard';
import { SparklesIcon } from './icons/SparklesIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { WavingHandIcon } from './icons/WavingHandIcon';
import { ThinkingFaceIcon } from './icons/ThinkingFaceIcon';
import { SmilingFaceIcon } from './icons/SmilingFaceIcon';
import { PhotoIcon } from './icons/PhotoIcon';

interface AiProfileProps {
    currentMood: Mood;
    onMoodChange: (mood: Mood) => void;
    affectionLevel: number;
    onAvatarUpdate: (url: string | null) => void;
}

const moodConfig = {
    Cheerful: { icon: SmilingFaceIcon, description: "Upbeat, sweet, and optimistic." },
    Thoughtful: { icon: FeatherIcon, description: "Deep, caring, and empathetic." },
    Playful: { icon: SparklesIcon, description: "Witty, fun, and a bit flirty." },
};

const actionConfig = {
    Wave: { keyframes: { rotate: [0, 15, -10, 15, -10, 0] }, transition: { duration: 1.5, ease: 'easeInOut' } },
    Think: { keyframes: { rotateZ: [0, -8, 8, 0], x: [0, -5, 5, 0] }, transition: { duration: 1.2, ease: 'easeInOut' } },
    Smile: { keyframes: { scale: [1, 1.06, 1], y: [0, -5, 0] }, transition: { duration: 0.8, type: 'spring', stiffness: 200, damping: 10 } },
    Cheerful: { keyframes: { y: [0, -6, 0, -6, 0], scale: [1, 1.02, 1, 1.02, 1] }, transition: { duration: 1.2, ease: 'easeInOut' } },
    Thoughtful: { keyframes: { rotateZ: [0, 4, -2, 0] }, transition: { duration: 1.8, ease: 'easeInOut' } },
    Playful: { keyframes: { rotateZ: [0, -5, 5, -5, 0], x: [0, 2, -2, 2, 0] }, transition: { duration: 1.0, ease: 'easeInOut' } },
};
type ActionName = 'Wave' | 'Think' | 'Smile';
const manualActions: ActionName[] = ['Wave', 'Think', 'Smile'];
const appearanceOptions: AppearanceName[] = ['Default', 'Cyberpunk', 'Fantasy', 'Gothic', 'Anime'];

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// FIX: Refactored to a plain function to avoid React.FC type conflicts with framer-motion props.
const AiProfile = ({ currentMood, onMoodChange, affectionLevel, onAvatarUpdate }: AiProfileProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const prevMood = useRef<Mood>(currentMood);
    
    const [isHovered, setIsHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [customAnimation, setCustomAnimation] = useState<any | null>(null);

    const [appearance, setAppearance] = useState<AppearanceName>('Default');
    const [customization, setCustomization] = useState<AvatarCustomization>({});
    
    const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null);
    const [isAvatarLoading, setIsAvatarLoading] = useState(true);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const { addNotification } = useNotifications();
    
    useEffect(() => {
        const fetchAvatar = async () => {
            setIsAvatarLoading(true);
            setAvatarError(null);
            onAvatarUpdate(null);
            try {
                const base64Image = await generateAvatar(currentMood, appearance, customization);
                const fullUrl = `data:image/jpeg;base64,${base64Image}`;
                setAvatarImageUrl(fullUrl);
                onAvatarUpdate(fullUrl);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Could not load appearance.";
                setAvatarError(errorMessage);
                addNotification({ message: errorMessage, type: 'error' });
                onAvatarUpdate(null);
            } finally {
                setIsAvatarLoading(false);
            }
        };
        fetchAvatar();
    }, [currentMood, appearance, customization, addNotification, onAvatarUpdate]);
    
    useEffect(() => {
        if (prevMood.current !== currentMood && !isAvatarLoading) {
            const timer = setTimeout(() => setCustomAnimation(actionConfig[currentMood]), 200);
            return () => clearTimeout(timer);
        }
        prevMood.current = currentMood;
    }, [currentMood, isAvatarLoading]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - left - width / 2, y: e.clientY - top - height / 2 });
    };
    
    const { width = 0, height = 0 } = containerRef.current?.getBoundingClientRect() ?? {};
    const rotateX = isHovered && height > 0 ? (-mousePos.y / (height / 2)) * 10 : 0;
    const rotateY = isHovered && width > 0 ? (mousePos.x / (width / 2)) * 10 : 0;
    const scale = isHovered ? 1.05 : 1;
    
    const getAffectionLevelText = (level: number) => {
        if (level < 25) return "Getting to know you";
        if (level < 50) return "Warming up";
        if (level < 75) return "Feeling close";
        return "Deeply Bonded";
    };
    
    const handleActionClick = (actionName: ActionName) => {
        if (customAnimation) return;
        setCustomAnimation(actionConfig[actionName]);
    };

    return (
        <motion.div className="flex flex-col gap-6 h-full" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl flex flex-col items-center text-center">
                <div ref={containerRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove} className="relative mb-4 w-full h-96 rounded-xl bg-base-800/50 flex items-center justify-center overflow-hidden border border-base-700/50" style={{ perspective: '1000px' }}>
                    {isAvatarLoading && <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-base-900/50"><PhotoIcon className="w-12 h-12 text-base-500 animate-pulse" /><p className="text-sm text-base-400 mt-2">Generating...</p></div>}
                    {avatarError && !isAvatarLoading && <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-base-900/50 p-4"><PhotoIcon className="w-12 h-12 text-red-500" /><p className="text-sm text-red-400 mt-2 text-center">{avatarError}</p></div>}
                    <motion.div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d', opacity: isAvatarLoading || avatarError ? 0 : 1 }} animate={{ y: isHovered ? 0 : [0, -8, 0], rotateX, rotateY, scale, ...(customAnimation?.keyframes || {}) }} transition={{ y: { duration: 8, ease: 'easeInOut', repeat: Infinity }, rotateX: { type: 'spring', stiffness: 150, damping: 20 }, rotateY: { type: 'spring', stiffness: 150, damping: 20 }, scale: { type: 'spring', stiffness: 150, damping: 20 }, ...(customAnimation?.transition || {}) }} onAnimationComplete={() => customAnimation && setCustomAnimation(null)}>
                       {avatarImageUrl && <img key={avatarImageUrl} src={avatarImageUrl} alt={`SHYN in ${currentMood} mood`} className="absolute inset-0 w-full h-full object-contain object-bottom animate-fade-in" loading="eager" />}
                    </motion.div>
                </div>
                <h2 className="text-2xl font-bold text-base-100">SHYN</h2>
                <p className="text-sm text-base-400 mt-1">Your Companion</p>
                <div className="w-full mt-6 text-left">
                    <label className="text-xs font-medium text-base-400">{getAffectionLevelText(affectionLevel)}</label>
                    <div className="w-full bg-base-800 rounded-full h-2 mt-1 relative overflow-hidden">
                        <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-secondary rounded-full" initial={{ width: 0 }} animate={{ width: `${affectionLevel}%` }} transition={{ duration: 0.5, ease: "easeOut" }}><div className="absolute inset-0 bg-white/20 opacity-20 blur-sm"></div></motion.div>
                    </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                 <h3 className="text-lg font-semibold text-base-200 mb-4">Select Mood</h3>
                 <div className="relative flex w-full rounded-full bg-base-800 p-1">
                    {(Object.keys(moodConfig) as Mood[]).map((mood) => (
                        <button key={mood} onClick={() => onMoodChange(mood)} className={`relative flex-1 py-2 text-sm font-semibold rounded-full z-10 transition-colors duration-300 ${currentMood === mood ? 'text-white' : 'text-base-400 hover:text-white'}`}>{mood}</button>
                    ))}
                    <motion.div className="absolute top-1 bottom-1 h-auto rounded-full bg-primary z-0" layoutId="activeMood" initial={false} animate={{ x: (Object.keys(moodConfig) as Mood[]).indexOf(currentMood) * (100 / 3) + '%', width: (100/3) + '%' }} transition={{ type: 'spring', stiffness: 200, damping: 25 }} />
                 </div>
                 <p className="text-center text-xs text-base-500 mt-3">{moodConfig[currentMood].description}</p>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                 <h3 className="text-lg font-semibold text-base-200 mb-4">Select Style</h3>
                 <div className="relative flex w-full rounded-full bg-base-800 p-1">
                    {appearanceOptions.map((style) => (
                        <button 
                            key={style} 
                            onClick={() => setAppearance(style)} 
                            className={`relative flex-1 py-2 px-1 text-xs font-semibold rounded-full z-10 transition-colors duration-300 whitespace-nowrap ${appearance === style ? 'text-white' : 'text-base-400 hover:text-white'}`}
                        >
                            {style}
                        </button>
                    ))}
                    <motion.div 
                        className="absolute top-1 bottom-1 h-auto rounded-full bg-primary z-0" 
                        layoutId="activeAppearance" 
                        initial={false} 
                        animate={{ 
                            x: appearanceOptions.indexOf(appearance) * (100 / appearanceOptions.length) + '%', 
                            width: (100 / appearanceOptions.length) + '%' 
                        }} 
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }} 
                    />
                 </div>
            </motion.div>

            <motion.div variants={itemVariants} className="p-6 bg-base-900/50 backdrop-blur-lg border border-base-700/50 rounded-2xl">
                 <h3 className="text-lg font-semibold text-base-200 mb-4">Actions</h3>
                 <div className="grid grid-cols-3 gap-3">
                    {manualActions.map((name) => {
                        const Icon = name === 'Wave' ? WavingHandIcon : name === 'Think' ? ThinkingFaceIcon : SmilingFaceIcon;
                        return <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} key={name} title={name} onClick={() => handleActionClick(name)} disabled={!!customAnimation} className="p-3 rounded-xl aspect-square flex flex-col items-center justify-center text-center transition-all duration-200 border-2 bg-base-800/50 border-base-700/50 hover:border-base-600 disabled:opacity-50 disabled:cursor-not-allowed" aria-label={`Trigger ${name} animation`}><Icon className="w-6 h-6 text-base-300" /><span className="text-xs mt-1 text-base-400">{name}</span></motion.button>
                    })}
                 </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="flex-1 min-h-0 hidden xl:flex flex-col gap-6">
                <FeatureCard icon={BrainCircuitIcon} title="I Remember You" description="I learn from our chats to make our conversations more personal and meaningful." />
                <FeatureCard title="Your Little Secret" description="Our conversations are private and safe. I'm here just for you." />
            </motion.div>
        </motion.div>
    );
};

export default AiProfile;
