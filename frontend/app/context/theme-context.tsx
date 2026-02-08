import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark';

type ThemeContextType = {
  mode: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'APP_THEME';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  // 🔹 Decide theme ONCE on startup
  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);

      if (savedTheme === 'light' || savedTheme === 'dark') {
        // ✅ User preference wins
        setMode(savedTheme);
      } else {
        // ✅ First launch → follow system
        const systemTheme = Appearance.getColorScheme() ?? 'light';
        setMode(systemTheme);
      }

      setIsReady(true);
    })();
  }, []);

  // 🔹 Explicit user choice
  const setTheme = async (theme: ThemeMode) => {
    setMode(theme);
    await AsyncStorage.setItem(THEME_KEY, theme);
  };

  const toggleTheme = () => {
    setTheme(mode === 'dark' ? 'light' : 'dark');
  };

  // ⛔ Prevent rendering until theme is decided
  if (!isReady) return null;

  return (
    <ThemeContext.Provider value={{ mode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
