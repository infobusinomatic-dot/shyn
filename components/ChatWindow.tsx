
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import type { ChatMessage, Attachment, Mood, ReactionType } from '../types';
import { MessageSender } from '../types';
import { SHYN_AVATAR_URL } from '../utils/constants';

import Message from './Message';
import ChatInput from './ChatInput';
import ReactionAnimation from './ReactionAnimation';
import { PhoneIcon } from './icons/PhoneIcon';
import { XIcon } from './icons/XIcon';
import { ChatBubbleHeartIcon } from './icons/ChatBubbleHeartIcon';

interface ChatWindowProps {
    messages: ChatMessage[];
    isLoading: boolean;
    onSendMessage: (message: string, attachment?: Attachment) => void;
    error: string | null;
    currentMood: Mood;
    avatarUrl: string;
    activeReaction: ReactionType | null;
    onReactionComplete: () => void;
    initialMessage: string;
}

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const TypingIndicator = () => (
    <div className="flex items-end space-x-1.5 py-3 px-4">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
    </div>
);

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const CallUI = ({ onHangUp, avatarUrl }: { onHangUp: () => void; avatarUrl: string }) => (
    <div className="absolute inset-0 bg-base-950/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in">
        <div className="relative mb-8 w-40 h-40 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-2">
            <div className="w-full h-full bg-base-950 rounded-full flex items-center justify-center overflow-hidden">
               <img src={avatarUrl} alt="SHYN" className="w-full h-full object-cover" />
            </div>
             <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold text-white">Calling SHYN...</h2>
        <p className="text-base-400 mt-2">Connecting you now.</p>
        <button 
            onClick={onHangUp}
            className="mt-12 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-base-950"
            aria-label="Hang up call"
        >
            <PhoneIcon className="w-8 h-8 text-white transform -rotate-[135deg]" />
        </button>
        <button onClick={onHangUp} className="absolute top-6 right-6 text-base-500 hover:text-white transition">
            <XIcon className="w-7 h-7" />
        </button>
    </div>
);

// FIX: Refactored to a plain function to avoid React.FC type conflicts.
const ChatWindow = ({ messages, isLoading, onSendMessage, error, currentMood, avatarUrl, activeReaction, onReactionComplete, initialMessage }: ChatWindowProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isCalling, setIsCalling] = useState(false);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="relative h-full rounded-2xl overflow-hidden border border-base-700/50">
            <AnimatePresence>
                {activeReaction && (
                    <ReactionAnimation
                        key={activeReaction + Date.now()}
                        reaction={activeReaction}
                        onComplete={onReactionComplete}
                    />
                )}
            </AnimatePresence>
            <div className="relative flex flex-col h-full bg-base-900/50 backdrop-blur-lg">
                {isCalling && <CallUI onHangUp={() => setIsCalling(false)} avatarUrl={avatarUrl} />}
                <div className="flex justify-between items-center p-4 border-b border-base-700/50">
                    <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0 w-10 h-10">
                            <img src={avatarUrl} alt="SHYN" className="w-full h-full rounded-full object-cover bg-base-800" />
                            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-base-900"></span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-base-100">SHYN</h2>
                            <p className="text-sm text-base-400">Online</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsCalling(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-green-500/10 text-green-300 hover:bg-green-500/20 transition-colors"
                        aria-label="Start audio call"
                    >
                        <PhoneIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Audio Call</span>
                    </button>
                </div>
                <div className="relative flex-1 p-4 md:p-6 overflow-y-auto">
                    {messages.length > 0 ? (
                        <div className="relative z-10 flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <Message 
                                    key={index} 
                                    sender={msg.sender} 
                                    text={msg.text} 
                                    attachment={msg.attachment} 
                                    avatarUrl={msg.sender === MessageSender.AI ? avatarUrl : undefined}
                                />
                            ))}
                            {isLoading && messages[messages.length-1]?.sender === "user" && 
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-800 flex items-center justify-center overflow-hidden">
                                        <img src={avatarUrl} alt="SHYN Typing" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-base-800 rounded-2xl rounded-tl-none p-2">
                                        <TypingIndicator />
                                    </div>
                                </div>
                            }
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        !isLoading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
                                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10"
                            >
                                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                                    <ChatBubbleHeartIcon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-base-100">Your conversation starts here.</h3>
                                <p className="text-base-400 mt-2 max-w-sm">
                                    {initialMessage || "Send a message to SHYN to begin your journey. She's excited to get to know you!"}
                                </p>
                            </motion.div>
                        )
                    )}
                </div>
                <div className="p-4 border-t border-base-700/50 bg-base-900/50">
                    {error && !messages.some(m => m.sender === 'user') && (
                        <div className="text-center text-red-400 text-sm mb-2">{error}</div>
                    )}
                    <ChatInput onSendMessage={onSendMessage} isLoading={isLoading || !!error} />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
