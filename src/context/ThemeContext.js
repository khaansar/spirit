import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { COLORS } from '../constants/theme';

const THEME_STORAGE_KEY = 'clearit_theme_mode';

const darkTheme = {
  isDark: true,
  colors: {
    bg: COLORS.slate[950],
    card: COLORS.slate[900],
    cardInner: COLORS.slate[950],
    cardBorder: COLORS.slate[800],
    text: COLORS.common.white,
    textSecondary: COLORS.slate[300],
    textMuted: COLORS.slate[400],
    border: COLORS.slate[800],
    divider: COLORS.slate[800],
    topBarBg: COLORS.slate[950],
    navBg: COLORS.slate[950],
    navBorder: COLORS.slate[900],
    inputBg: COLORS.slate[950],
    inputBorder: COLORS.slate[800],
    accent: COLORS.brand[600],
    accentLight: COLORS.brand[400],
    badgeBg: 'rgba(94, 67, 243, 0.15)',
    badgeBorder: 'rgba(94, 67, 243, 0.3)',
    statusSuccess: COLORS.status.success,
    statusWarning: COLORS.status.warning,
    statusError: COLORS.status.error,
  },
};

const lightTheme = {
  isDark: false,
  colors: {
    bg: '#f8fafc', // slate-50
    card: '#ffffff', // white
    cardInner: '#f1f5f9', // slate-100
    cardBorder: '#e2e8f0', // slate-200
    text: '#0f172a', // slate-900
    textSecondary: '#334155', // slate-700
    textMuted: '#64748b', // slate-500
    border: '#e2e8f0',
    divider: '#f1f5f9',
    topBarBg: '#ffffff',
    navBg: '#ffffff',
    navBorder: '#e2e8f0',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    accent: COLORS.brand[600],
    accentLight: COLORS.brand[600],
    badgeBg: 'rgba(94, 67, 243, 0.1)',
    badgeBorder: 'rgba(94, 67, 243, 0.25)',
    statusSuccess: '#16a34a',
    statusWarning: '#d97706',
    statusError: '#dc2626',
  },
};

const ThemeContext = createContext({
  isDark: true,
  theme: darkTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    storage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light') {
        setIsDark(false);
      } else if (saved === 'dark') {
        setIsDark(true);
      }
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      storage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
