import React from 'react';
import { motion } from 'framer-motion';

// FIX: Changed import for MessageSender from 'import type' to a value import
// because it is an enum and used as a value (e.g., MessageSender.AI).
import { MessageSender } from '../types';
import type { Attachment } from '../types';
import { SHYN_AVATAR_URL } from '../utils/constants';

import { UserIcon } from './icons/UserIcon';

interface MessageProps {
    sender: MessageSender;
    text: string;
    attachment?: Attachment;
    avatarUrl?: string;
}

const Message: React.FC<MessageProps> = ({ sender, text, attachment, avatarUrl }) => {
    const isAI = sender === MessageSender.AI;
    const isImage = attachment?.type.startsWith('image/');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-start gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
        >
            {isAI && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-800 flex items-center justify-center overflow-hidden">
                    <img src={avatarUrl || SHYN_AVATAR_URL} alt="SHYN" className="w-full h-full object-cover" />
                </div>
            )}
            <div 
                className={`max-w-md md:max-w-lg lg:max-w-xl rounded-2xl overflow-hidden shadow-md ${
                    isAI 
                    ? 'bg-base-800 text-base-300 rounded-tl-none' 
                    : 'bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-none'
                }`}
            >
                {isImage && (
                    <img src={attachment.url} alt={attachment.name} className="w-full h-auto object-cover" />
                )}
                {text && (
                     <div className="px-4 py-3 prose prose-sm prose-invert prose-p:my-0">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
                     </div>
                )}
            </div>
             {!isAI && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-base-700 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-base-300" />
                </div>
            )}
        </motion.div>
    );
};

export default Message;