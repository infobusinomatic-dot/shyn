



export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface Attachment {
  name: string;
  type: string; // MIME type
  url: string;  // data URL
}

// FIX: Moved Mood type definition before ChatMessage and added the mood property
// to align with usage in ChatView.tsx and API services, resolving typing errors.
export type Mood = 'Cheerful' | 'Thoughtful' | 'Playful';

export interface ChatMessage {
  sender: MessageSender;
  text: string;
  attachment?: Attachment;
  mood: Mood;
}

// New type for AI memory
export interface Memory {
  id: string;
  topic: string;
  detail: string;
  timestamp: number;
}

// New types for visual appearance
export type AppearanceName = 'Default' | 'Cyberpunk' | 'Fantasy' | 'Gothic' | 'Anime';

export interface Appearance {
  name: AppearanceName;
  moods: Record<Mood, string>;
}

export interface AvatarCustomization {
  hairColor?: string;
  eyeColor?: string;
  hairstyle?: string;
  clothing?: string;
  accessory?: string;
}

export interface AppearancePreset {
  id: number;
  name: string;
  appearanceName: AppearanceName;
  mood: Mood;
  customization: AvatarCustomization;
  imageUrl: string;
}


// User and page management
export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'away' | 'inactive';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  lastActive: string;
  status: UserStatus;
}

export type Page = 'Chat' | 'Profile' | 'Settings' | 'Admin';

// New types for notifications and activity logs
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

export interface ActivityLogEntry {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  icon: 'login' | 'logout' | 'update' | 'delete';
}

export interface AnalyticsDataPoint {
    date: string;
    users: number;
}

export type ReactionType = 'HEART' | 'LAUGH' | 'SURPRISE' | 'CELEBRATE';