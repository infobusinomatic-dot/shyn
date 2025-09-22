import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface SettingsContextType {
    isAmbientSoundEnabled: boolean;
    toggleAmbientSound: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = 'shyn_user_settings';

const getInitialSettings = () => {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            return {
                isAmbientSoundEnabled: parsed.isAmbientSoundEnabled ?? true,
            };
        }
    } catch (error) {
        console.error("Failed to load settings from localStorage:", error);
    }
    return {
        isAmbientSoundEnabled: true, // Default to on
    };
}


export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAmbientSoundEnabled, setIsAmbientSoundEnabled] = useState<boolean>(getInitialSettings().isAmbientSoundEnabled);

    const toggleAmbientSound = useCallback(() => {
        setIsAmbientSoundEnabled(prev => {
            const newState = !prev;
            try {
                const settings = { isAmbientSoundEnabled: newState };
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
            } catch (error) {
                console.error("Failed to save settings to localStorage:", error);
            }
            return newState;
        });
    }, []);
    
    const value = { isAmbientSoundEnabled, toggleAmbientSound };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
