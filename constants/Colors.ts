const tintColorLight = '#667eea';
const tintColorDark = '#764ba2';

export default {
  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    background: '#F8FAFC',
    backgroundSecondary: '#FFFFFF',
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
      verySad: '#F87171',
      sad: '#FB923C',
      neutral: '#FCD34D',
      happy: '#4ADE80',
      veryHappy: '#60A5FA',
    },
    symptomLevels: {
      low: '#10B981',
      medium: '#FBBF24',
      high: '#EF4444',
    }
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    tint: tintColorDark,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorDark,
    cardBackground: '#1E293B',
    border: '#334155',
    error: '#F87171',
    warning: '#FBBF24',
    success: '#34D399',
    selected: 'rgba(118, 75, 162, 0.2)',
    moodColors: {
      verySad: '#F87171',
      sad: '#FB923C',
      neutral: '#FCD34D',
      happy: '#4ADE80',
      veryHappy: '#60A5FA',
    },
    symptomLevels: {
      low: '#34D399',
      medium: '#FCD34D',
      high: '#F87171',
    }
  },
};