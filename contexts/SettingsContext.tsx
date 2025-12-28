import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getWebSettings, WebSettings } from '../services/settingsService';

interface SettingsContextType {
    settings: WebSettings;
    isLoading: boolean;
    refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<WebSettings>({});
    const [isLoading, setIsLoading] = useState(true);

    const refreshSettings = async () => {
        try {
            const data = await getWebSettings();
            setSettings(data);
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
