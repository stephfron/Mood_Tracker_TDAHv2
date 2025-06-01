const tintColorLight = '#6366F1';
const tintColorDark = '#818CF8';

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
    selected: 'rgba(99, 102, 241, 0.1)',
    moodColors: {
      verySad: '#EF4444', // Red
      sad: '#F97316', // Orange
      neutral: '#FBBF24', // Yellow
      happy: '#34D399', // Green
      veryHappy: '#38BDF8', // Blue
    },
    symptomLevels: {
      low: '#10B981', // Success Green
      medium: '#FBBF24', // Yellow
      high: '#EF4444', // Red
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
    selected: 'rgba(129, 140, 248, 0.2)',
    moodColors: {
      verySad: '#F87171', // Red
      sad: '#FB923C', // Orange
      neutral: '#FCD34D', // Yellow
      happy: '#4ADE80', // Green
      veryHappy: '#60A5FA', // Blue
    },
    symptomLevels: {
      low: '#34D399', // Success Green
      medium: '#FCD34D', // Yellow
      high: '#F87171', // Red
    }
  },
};