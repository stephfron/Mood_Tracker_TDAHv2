import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry, UserStats } from '@/types/mood';

// Keys
const MOOD_ENTRIES_KEY = 'moodtracker_entries';
const USER_STATS_KEY = 'moodtracker_stats';
const REMINDER_SETTINGS_KEY = 'moodtracker_reminders';

async function setItem(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error storing data:', e);
  }
}

async function getItem(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error retrieving data:', e);
    return null;
  }
}

async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data:', e);
  }
}

// Mood entries functions
export async function saveMoodEntry(entry: MoodEntry): Promise<boolean> {
  try {
    const existingEntriesJson = await getItem(MOOD_ENTRIES_KEY);
    const existingEntries: MoodEntry[] = existingEntriesJson 
      ? JSON.parse(existingEntriesJson) 
      : [];
    
    // Generate a unique ID if not provided
    if (!entry.id) {
      entry.id = Date.now().toString();
    }
    
    // Check if updating an existing entry
    const existingIndex = existingEntries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      existingEntries[existingIndex] = entry;
    } else {
      existingEntries.push(entry);
    }
    
    await setItem(MOOD_ENTRIES_KEY, JSON.stringify(existingEntries));
    await updateStatsAfterEntry();
    return true;
  } catch (e) {
    console.error('Error saving mood entry:', e);
    return false;
  }
}

export async function getMoodEntries(): Promise<MoodEntry[]> {
  try {
    const entriesJson = await getItem(MOOD_ENTRIES_KEY);
    return entriesJson ? JSON.parse(entriesJson) : [];
  } catch (e) {
    console.error('Error getting mood entries:', e);
    return [];
  }
}

export async function deleteMoodEntry(id: string): Promise<boolean> {
  try {
    const entriesJson = await getItem(MOOD_ENTRIES_KEY);
    if (!entriesJson) return false;
    
    const entries: MoodEntry[] = JSON.parse(entriesJson);
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    await setItem(MOOD_ENTRIES_KEY, JSON.stringify(filteredEntries));
    return true;
  } catch (e) {
    console.error('Error deleting mood entry:', e);
    return false;
  }
}

// Stats functions
export async function getUserStats(): Promise<UserStats> {
  try {
    const statsJson = await getItem(USER_STATS_KEY);
    return statsJson 
      ? JSON.parse(statsJson) 
      : { currentStreak: 0, longestStreak: 0, totalEntries: 0 };
  } catch (e) {
    console.error('Error getting user stats:', e);
    return { currentStreak: 0, longestStreak: 0, totalEntries: 0 };
  }
}

async function updateStatsAfterEntry(): Promise<void> {
  try {
    const entries = await getMoodEntries();
    const stats = await getUserStats();
    
    // Update total entries
    stats.totalEntries = entries.length;
    
    // Calculate streak
    const dateStrings = entries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    });
    
    // Get unique dates (in case of multiple entries per day)
    const uniqueDates = [...new Set(dateStrings)].sort();
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    
    // Check if there's an entry for today
    if (uniqueDates.includes(todayString)) {
      currentStreak = 1;
      
      // Check previous days
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let checkDate = yesterday;
      let keepChecking = true;
      
      while (keepChecking) {
        const checkDateString = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
        
        if (uniqueDates.includes(checkDateString)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          keepChecking = false;
        }
      }
    }
    
    stats.currentStreak = currentStreak;
    
    // Update longest streak if needed
    if (currentStreak > stats.longestStreak) {
      stats.longestStreak = currentStreak;
    }
    
    await setItem(USER_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error updating user stats:', e);
  }
}

// Reminders settings
export interface ReminderSettings {
  enabled: boolean;
  times: string[]; // Format: "HH:MM"
  message: string;
}

export const DEFAULT_REMINDER_SETTINGS: ReminderSettings = {
  enabled: false,
  times: ["09:00", "20:00"],
  message: "N'oubliez pas de noter votre humeur aujourd'hui !"
};

export async function getReminderSettings(): Promise<ReminderSettings> {
  try {
    const settingsJson = await getItem(REMINDER_SETTINGS_KEY);
    return settingsJson 
      ? JSON.parse(settingsJson) 
      : DEFAULT_REMINDER_SETTINGS;
  } catch (e) {
    console.error('Error getting reminder settings:', e);
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export async function saveReminderSettings(settings: ReminderSettings): Promise<boolean> {
  try {
    await setItem(REMINDER_SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Error saving reminder settings:', e);
    return false;
  }
}

// Export all data
export async function exportUserData(): Promise<string> {
  try {
    const entries = await getMoodEntries();
    const stats = await getUserStats();
    const reminderSettings = await getReminderSettings();
    
    const exportData = {
      entries,
      stats,
      reminderSettings,
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (e) {
    console.error('Error exporting user data:', e);
    throw new Error('Échec de l\'exportation des données');
  }
}