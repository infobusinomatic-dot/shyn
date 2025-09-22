

import { MessageSender } from '../types';
import type { User, ChatMessage, Mood, Attachment, AppearanceName, AnalyticsDataPoint } from '../types';

const mockMe: User = {
  id: 1,
  name: 'Demo User',
  email: 'user@example.com',
  role: 'admin',
  avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/shyn-realistic/user-avatar-2.png',
  lastActive: 'Online',
  status: 'active',
};

const mockUsers: User[] = [
    mockMe,
    { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user', avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/shyn-realistic/user-avatar-1.png', lastActive: '2 hours ago', status: 'away' },
    { id: 3, name: 'John Smith', email: 'john@example.com', role: 'user', avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/shyn-realistic/user-avatar-3.png', lastActive: '5 days ago', status: 'inactive' },
    { id: 4, name: 'Emily White', email: 'emily@example.com', role: 'user', avatarUrl: 'https://storage.googleapis.com/aistudio-hosting/shyn-realistic/user-avatar-4.png', lastActive: '10 minutes ago', status: 'active' },
];


// --- User Endpoints ---
export const getMe = async (): Promise<User> => {
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    return Promise.resolve(mockMe);
};

export const getUsers = async (): Promise<User[]> => {
    await new Promise(res => setTimeout(res, 500));
    return Promise.resolve(mockUsers);
}

// --- Chat Endpoints ---
export const getChatHistory = async (userId: number, mood: Mood): Promise<ChatMessage[]> => {
    // Return empty history as we are not persisting chat without a backend
    return Promise.resolve([]);
};

interface SaveMessagePayload {
    // FIX: Changed sender type from a string literal to the MessageSender enum to match ChatMessage.
    sender: MessageSender;
    text: string;
    mood: Mood;
    attachment?: Attachment;
}

export const saveMessage = async (userId: number, message: SaveMessagePayload): Promise<ChatMessage> => {
    // Mock function: does nothing, just returns the message as if it were saved
    return Promise.resolve({ ...message, mood: message.mood });
};

// --- SHYN Avatar Endpoint (No longer needed, implemented in geminiService) ---

// --- Admin & Analytics Endpoints ---
interface AdminStats {
    total: number;
    active: number;
    admins: number;
}
export const getAdminStats = async (): Promise<AdminStats> => {
    await new Promise(res => setTimeout(res, 500));
    return Promise.resolve({
        total: 4,
        active: 2,
        admins: 1,
    });
}

export const getUserActivity = async (): Promise<AnalyticsDataPoint[]> => {
     await new Promise(res => setTimeout(res, 500));
     const today = new Date();
     const data = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return {
            date: date.toLocaleString('en-US', { month: 'short', day: 'numeric' }),
            users: Math.floor(Math.random() * 10) + i + 1,
        };
    });
    return Promise.resolve(data);
}