import type { Memory, ChatMessage, User } from '../types';
import { extractMemories } from './geminiService';

const getMemoryStorageKey = (userId: number) => `shyn_memories_${userId}`;

export const getMemories = (userId: number): Memory[] => {
    try {
        const storedMemories = localStorage.getItem(getMemoryStorageKey(userId));
        return storedMemories ? JSON.parse(storedMemories) : [];
    } catch (error) {
        console.error("Failed to retrieve memories:", error);
        return [];
    }
};

const saveMemories = (userId: number, memories: Memory[]): void => {
    try {
        localStorage.setItem(getMemoryStorageKey(userId), JSON.stringify(memories));
    } catch (error) {
        console.error("Failed to save memories:", error);
    }
};

export const processAndStoreMemories = async (
    userId: number,
    userName: string,
    conversationTurn: { user: ChatMessage, ai: ChatMessage }
): Promise<void> => {
    try {
        const newMemories = await extractMemories(conversationTurn, userName);

        if (newMemories.length > 0) {
            const allMemories = getMemories(userId);
            const memoriesToSave: Memory[] = [];

            for (const newMemory of newMemories) {
                 if (!allMemories.some(mem => mem.detail.toLowerCase() === newMemory.detail.toLowerCase())) {
                    memoriesToSave.push({
                        ...newMemory,
                        id: `${Date.now()}-${Math.random()}`,
                        timestamp: Date.now(),
                    });
                }
            }

            if (memoriesToSave.length > 0) {
                const updatedMemories = [...allMemories, ...memoriesToSave];
                saveMemories(userId, updatedMemories);
                console.log("Saved new memories:", memoriesToSave);
            }
        }
    } catch (error) {
        console.error("Error processing and storing memories:", error);
    }
};

export const getRecentMemories = (userId: number, limit: number = 5): Memory[] => {
    const memories = getMemories(userId);
    return memories.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
}
