import React, { useState, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { motion } from 'framer-motion';

import type { ChatMessage, Mood, Attachment, User, ReactionType } from '../types';
import { MessageSender } from '../types';
import { initializeChat, sendMessageToAI } from '../services/geminiService';
import { getChatHistory } from '../services/apiService';
import { playNewMessageSound } from '../services/soundService';
import { useSettings } from '../contexts/SettingsContext';
import { ambientSoundService } from '../services/audioService';
import { SHYN_AVATAR_URL } from '../utils/constants';
import { getRecentMemories, processAndStoreMemories } from '../services/memoryService';

import AiProfile from './AiProfile';
import ChatWindow from './ChatWindow';

interface ChatViewProps {
    user: User;
    onAvatarUpdate: (url: string | null) => void;
}

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

const ChatView: React.FC<ChatViewProps> = ({ user, onAvatarUpdate }) => {
    const [currentMood, setCurrentMood] = useState<Mood>('Cheerful');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chat, setChat] = useState<Chat | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSending, setIsSending] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [affectionLevel, setAffectionLevel] = useState<number>(15);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string>(SHYN_AVATAR_URL);
    const [activeReaction, setActiveReaction] = useState<ReactionType | null>(null);
    const { isAmbientSoundEnabled } = useSettings();
    const [initialMessage, setInitialMessage] = useState<string>('');


    // Main effect for initializing chat and loading state when mood or user changes.
    useEffect(() => {
        const affectionStorageKey = `affectionLevel_${user.id}_${currentMood}`;

        const loadAndInitChat = async () => {
            setIsLoading(true);
            setError(null);

            const savedAffection = localStorage.getItem(affectionStorageKey);
            const currentAffection = savedAffection ? JSON.parse(savedAffection) : 15;
            setAffectionLevel(currentAffection);
            
            try {
                const history = await getChatHistory(user.id, currentMood);
                const memories = getRecentMemories(user.id);
                const { chat: newChat, initialMessage: generatedInitialMessage } = initializeChat(currentMood, currentAffection, user.name, history, memories);
                setChat(newChat);
                setInitialMessage(generatedInitialMessage);

                if (history.length > 0) {
                    setMessages(history);
                } else {
                    setMessages([]);
                }

            } catch (err) {
                console.error(err);
                let errorMessage: string;
                if (err instanceof Error) {
                     errorMessage = err.message.includes("API_KEY")
                        ? "There seems to be a configuration issue. I'm unable to connect to my core services right now."
                        : err.message;
                } else {
                    errorMessage = "An unknown error occurred during initialization.";
                }
                
                setError(errorMessage);
                setMessages([{ sender: MessageSender.AI, text: errorMessage, mood: currentMood }]);
            } finally {
                setIsLoading(false);
            }
        };

        loadAndInitChat();
    }, [currentMood, user.id, user.name]);
    
    // Effect to save affection level to localStorage
    useEffect(() => {
        const affectionStorageKey = `affectionLevel_${user.id}_${currentMood}`;
        localStorage.setItem(affectionStorageKey, JSON.stringify(affectionLevel));
    }, [affectionLevel, currentMood, user.id]);
    
    // Effect for affection decay over time for certain moods
    useEffect(() => {
        if ((currentMood === 'Thoughtful' || currentMood === 'Playful') && affectionLevel > 15) {
            const decayInterval = setInterval(() => {
                setAffectionLevel(prev => Math.max(15, prev - 0.5));
            }, 30000); 

            return () => clearInterval(decayInterval);
        }
    }, [currentMood, affectionLevel]);
    
    // Effect for managing ambient sounds
    useEffect(() => {
        if (isAmbientSoundEnabled) {
            ambientSoundService.play(currentMood);
        } else {
            ambientSoundService.stop();
        }
    }, [currentMood, isAmbientSoundEnabled]);

    // Cleanup effect for when the component unmounts
    useEffect(() => {
        return () => {
            ambientSoundService.cleanup();
        }
    }, []);


    const handleSendMessage = async (messageText: string, attachment?: Attachment) => {
        if ((!messageText.trim() && !attachment) || isLoading || isSending || !chat) return;

        const userMessage: ChatMessage = { sender: MessageSender.USER, text: messageText, attachment, mood: currentMood };
        setMessages(prev => [...prev, userMessage]);
        setIsSending(true);
        setAffectionLevel(prev => Math.min(prev + 2, 100));

        try {
            const { text: aiResponseText, reaction } = await sendMessageToAI(chat, user, messageText, currentMood, attachment);
            
            if (reaction) {
                setActiveReaction(reaction);
            }

            const delay = Math.random() * 1000 + 500;
            await new Promise(resolve => setTimeout(resolve, delay));

            const aiMessage: ChatMessage = { sender: MessageSender.AI, text: aiResponseText, mood: currentMood };
            setMessages(prev => [...prev, aiMessage]);
            playNewMessageSound();
            
            processAndStoreMemories(user.id, user.name, { user: userMessage, ai: aiMessage }).catch(err => {
                console.error("Failed to process and store memory:", err);
            });
        } catch (err) {
            console.error(err);
            const errorMessageText = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
            const errorMessage: ChatMessage = { sender: MessageSender.AI, text: errorMessageText, mood: currentMood };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };
    
    const handleMoodChange = (newMood: Mood) => {
        if (newMood !== currentMood) {
            setCurrentMood(newMood);
        }
    };

    const handleAvatarGenerated = (url: string | null) => {
        onAvatarUpdate(url); // Update the global app background
        if (url) {
            setCurrentAvatarUrl(url); // Update the avatar used in the chat UI
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 h-full overflow-hidden"
        >
            <motion.aside variants={itemVariants} className="lg:col-span-1 xl:col-span-1 h-full overflow-y-auto">
                <AiProfile 
                    currentMood={currentMood}
                    onMoodChange={handleMoodChange}
                    affectionLevel={affectionLevel}
                    onAvatarUpdate={handleAvatarGenerated}
                />
            </motion.aside>
            <motion.div variants={itemVariants} className="lg:col-span-2 xl:col-span-3 h-full flex flex-col">
               <ChatWindow
                   messages={messages}
                   isLoading={isLoading || isSending}
                   onSendMessage={handleSendMessage}
                   error={error}
                   currentMood={currentMood}
                   avatarUrl={currentAvatarUrl}
                   activeReaction={activeReaction}
                   onReactionComplete={() => setActiveReaction(null)}
                   initialMessage={initialMessage}
               />
            </motion.div>
        </motion.div>
    );
};

export default ChatView;