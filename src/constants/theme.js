/**
 * ClearIt Brand Theme Tokens
 * Matches exact colors from web globals.css & Tailwind configuration
 */

export const COLORS = {
  // Brand Primary (matches --color-brand-600 / --color-brand-700)
  brand: {
    50: '#f3f1ff',
    100: '#e8e4ff',
    200: '#d4ccff',
    300: '#b5a5fe',
    400: '#9377fd',
    500: '#734cf9',
    600: '#5e43f3', // Main Brand Color
    700: '#4d36c6', // Hover / Pressed state
    800: '#3e2a9e',
    900: '#342480',
  },

  // Brand Accent Gradient Tones (matches BrandLogo "It" gradient)
  accent: {
    sky: '#0ea5e9',
    skyLight: '#38bdf8',
    blue: '#2563eb',
    indigo: '#4f46e5',
  },

  // Slate Neutral Tones (matches Web dark & light backgrounds)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617', // Deepest dark background
  },

  // Status & Feedback Tokens
  status: {
    success: '#10b981',
    successBg: '#064e3b',
    error: '#ef4444',
    errorBg: '#450a0a',
    errorLightBg: '#fef2f2',
    errorLightText: '#b91c1c',
    warning: '#f59e0b',
    warningBg: '#451a03',
    info: '#3b82f6',
  },

  // Exam Tokens (matches Web globals.css exam engine)
  exam: {
    accent: '#1e3a8a',
    accentLight: '#eff6ff',
    accentBorder: '#bfdbfe',
    bg: '#f8fafc',
    panel: '#ffffff',
    border: '#e2e8f0',
    text: '#334155',
    textMuted: '#64748b',
  },

  common: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
};

// Default Dark Theme Palette (Sleek dark mode matching web login)
export const THEME = {
  background: COLORS.slate[950],
  card: COLORS.slate[900],
  cardBorder: COLORS.slate[800],
  inputBg: COLORS.slate[900],
  inputBorder: COLORS.slate[700],
  inputText: COLORS.common.white,
  inputPlaceholder: COLORS.slate[500],
  primary: COLORS.brand[600],
  primaryPressed: COLORS.brand[700],
  primaryText: COLORS.common.white,
  textPrimary: COLORS.common.white,
  textSecondary: COLORS.slate[400],
  textMuted: COLORS.slate[500],
  divider: COLORS.slate[800],
};

export default { COLORS, THEME };
