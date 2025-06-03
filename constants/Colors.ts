const tintColorLight = '#667eea';
const tintColorDark = '#764ba2';

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
      verySad: '#EF4444',  // Red for very sad
      sad: '#F59E0B',      // Orange for sad
      neutral: '#94A3B8',  // Gray for neutral
      happy: '#10B981',    // Green for happy
      veryHappy: '#667eea' // Blue/Purple for very happy
    }
  },
  dark: {
    text: '#F8FAFC',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textEmphasis: '#e2e8f0',
    background: '#0f172a',
    backgroundPrimary: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: 'rgba(30, 41, 59, 0.8)',
    tint: tintColorDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    cardBackground: '#1E293B',
    border: '#334155',
    borderPrimary: 'rgba(51, 65, 85, 0.5)',
    borderAccentBlue: 'rgba(59, 130, 246, 0.2)',
    borderAccentGreen: 'rgba(34, 197, 94, 0.3)',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    selected: 'rgba(118, 75, 162, 0.2)',
    accentBlue: '#3b82f6',
    accentPurple: '#8b5cf6',
    accentGreen: '#22c55e',
    accentRed: '#ef4444',
    accentYellow: '#f59e0b',
    selectedBackgroundBlue: 'rgba(59, 130, 246, 0.1)',
    selectedBackgroundPurple: 'rgba(139, 92, 246, 0.1)',
    selectedBackgroundGreen: 'rgba(34, 197, 94, 0.2)',
    moodColors: {
      verySad: '#F87171',  // Red for very sad
      sad: '#FBBF24',      // Orange for sad
      neutral: '#94A3B8',  // Gray for neutral
      happy: '#34D399',    // Green for happy
      veryHappy: '#8B5CF6' // Purple for very happy
    }
  },
};