
import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import type { Attachment } from '../types';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useNotifications } from '../contexts/NotificationContext';

interface ChatInputProps {
    onSendMessage: (message: string, attachment?: Attachment) => void;
    isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addNotification } = useNotifications();

    const { isListening, transcript, startListening, stopListening } = useVoiceRecognition({
        onTranscript: (text) => setInput(text),
        onError: (error) => addNotification({ message: `Voice error: ${error}`, type: 'error' }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input);
            setInput('');
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                addNotification({ message: 'File is too large (max 5MB).', type: 'error'});
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                const url = e.target?.result as string;
                onSendMessage(input, { name: file.name, type: file.type, url });
                setInput('');
            };
            reader.readAsDataURL(file);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />
            
            <div className="relative flex-1 flex items-center bg-base-800 border border-base-700/80 rounded-full px-2 py-1.5 shadow-inner shadow-black/20">
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-base-700/50 text-base-400 hover:text-white disabled:opacity-50"
                    aria-label="Attach file"
                >
                    <PaperclipIcon className="w-5 h-5" />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isListening ? "Listening..." : "Type your message..."}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none px-3 text-base-200 placeholder-base-500 focus:outline-none focus:ring-0 disabled:opacity-50"
                    autoComplete="off"
                />
                 <button
                    type="button"
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-base-700/50 text-base-400 hover:text-white disabled:opacity-50`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                    {isListening && <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></span>}
                    <MicrophoneIcon className={`w-5 h-5 z-10 ${isListening ? 'text-primary' : 'text-base-300'}`} />
                </button>
            </div>
            
            <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center transition-all duration-200 shadow-[0_0_20px] shadow-primary/30 hover:shadow-primary/50 hover:bg-primary-dark disabled:bg-base-700 disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-base-900"
                aria-label="Send message"
            >
                <SendIcon className="w-6 h-6 text-white" />
            </button>
        </form>
    );
};

export default ChatInput;