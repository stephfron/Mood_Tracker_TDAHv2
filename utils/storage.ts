import AsyncStorage from '@react-native-async-storage/async-storage';
import { MoodEntry, UserStats, ConfiguredMedication, ReminderSettings, DEFAULT_REMINDER_SETTINGS } from '@/types/mood'; // Added ConfiguredMedication etc.

// Keys
const MOOD_ENTRIES_KEY = 'moodtracker_entries';
const USER_STATS_KEY = 'moodtracker_stats';
const REMINDER_SETTINGS_KEY = 'moodtracker_reminders';
const CONFIGURED_MEDICATIONS_KEY = 'moodtracker_configured_medications'; // New key

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
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    
    // Get unique dates (in case of multiple entries per day)
    const uniqueDates = [...new Set(dateStrings)].sort();
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const todayYear = today.getFullYear();
    const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const todayDay = today.getDate().toString().padStart(2, '0');
    const todayString = `${todayYear}-${todayMonth}-${todayDay}`;
    
    // Check if there's an entry for today
    if (uniqueDates.includes(todayString)) {
      currentStreak = 1;
      
      // Check previous days
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let checkDate = yesterday;
      let keepChecking = true;
      
      while (keepChecking) {
        const checkYear = checkDate.getFullYear();
        const checkMonth = (checkDate.getMonth() + 1).toString().padStart(2, '0');
        const checkDay = checkDate.getDate().toString().padStart(2, '0');
        const checkDateString = `${checkYear}-${checkMonth}-${checkDay}`;
        
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

// Configured Medications functions
export async function saveConfiguredMedications(meds: ConfiguredMedication[]): Promise<boolean> {
  try {
    await setItem(CONFIGURED_MEDICATIONS_KEY, JSON.stringify(meds));
    return true;
  } catch (e) {
    console.error('Error saving configured medications:', e);
    return false;
  }
}

export async function getConfiguredMedications(): Promise<ConfiguredMedication[]> {
  try {
    const medsJson = await getItem(CONFIGURED_MEDICATIONS_KEY);
    if (medsJson) {
      return JSON.parse(medsJson);
    } else {
      // For initial testing, if no configured medications are found, save and return a default list:
      const defaultMeds: ConfiguredMedication[] = [
        { id: 'med_default_1', name: 'Methylphenidate (Ritaline)', dosage: '10mg', time: '08:00' },
        { id: 'med_default_2', name: 'Lisdexamfétamine (Elvanse)', dosage: '30mg', time: '08:00' },
      ];
      await saveConfiguredMedications(defaultMeds); // Save them for next time
      return defaultMeds;
    }
  } catch (e) {
    console.error('Error getting configured medications:', e);
    // In case of an error (e.g., parsing error), also return default or empty
    // For robustness, could attempt to return defaultMeds here too, or just empty.
    return [];
  }
}

// Reminders settings
// ReminderSettings and DEFAULT_REMINDER_SETTINGS are now imported from types/mood if they were moved there.
// Assuming they are still locally defined or correctly imported if moved.
// If they were not moved to types/mood.ts, this part remains fine.
// For this diff, I'm assuming ReminderSettings and DEFAULT_REMINDER_SETTINGS are now imported from @/types/mood as well for consistency.

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