const tintColorLight = '#667eea';
const tintColorDark = '#764ba2';

const darkPaletteBase = {
  backgroundPrimary: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: 'rgba(30, 41, 59, 0.8)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textEmphasis: '#e2e8f0',
  accentBlue: '#3b82f6',
  accentGreen: '#22c55e',
  accentPurple: '#8b5cf6',
  accentRed: '#ef4444',
  accentOrange: '#f97316',
  borderPrimary: 'rgba(51, 65, 85, 0.5)',
  borderAccentBlue: 'rgba(59, 130, 246, 0.2)',
  borderAccentGreen: 'rgba(34, 197, 94, 0.3)',
  selectedBackgroundBlue: 'rgba(59, 130, 246, 0.25)',
  selectedBackgroundPurple: 'rgba(139, 92, 246, 0.25)',
  selectedBackgroundGreen: 'rgba(34, 197, 94, 0.25)',
  tabIconSelected: '#3b82f6',
  tabIconDefault: '#64748b',
  moodPositive: '#22c55e',
  moodNegative: '#ef4444',
  moodNeutral: '#64748b',
  cognitiveFocused: '#3b82f6',
  cognitiveScattered: '#8b5cf6',
  cognitiveFoggy: '#64748b',
  cognitiveHyperactive: '#f97316',
  cognitiveTired: '#4b5563',
};

export default {
  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    tint: tintColorLight,
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    border: '#E2E8F0',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    selected: 'rgba(102, 126, 234, 0.1)',
    moodColors: {
      verySad: '#EF4444',
      sad: '#F59E0B',
      neutral: '#94A3B8',
      happy: '#10B981',
      veryHappy: '#667eea'
    },
    symptomLevels: {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444'
    }
  },
  dark: {
    ...darkPaletteBase,
    tint: darkPaletteBase.accentBlue,
    cardBackground: darkPaletteBase.backgroundSecondary,
    moodColors: {
      positive: darkPaletteBase.moodPositive,
      negative: darkPaletteBase.moodNegative,
      neutral: darkPaletteBase.moodNeutral,
    },
    cognitiveColors: {
      focused: darkPaletteBase.cognitiveFocused,
      scattered: darkPaletteBase.cognitiveScattered,
      foggy: darkPaletteBase.cognitiveFoggy,
      hyperactive: darkPaletteBase.cognitiveHyperactive,
      tired: darkPaletteBase.cognitiveTired,
    }
  },
};