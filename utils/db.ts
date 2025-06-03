import * as SQLite from 'expo-sqlite';
import { MoodEntry, DEFAULT_MOOD_ENTRY } from '@/types/mood';

const db = SQLite.openDatabase('moodtracker.db');

// Initialize database tables
export function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS mood_entries (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL,
          mood TEXT NOT NULL,
          intensity INTEGER,
          concentration TEXT,
          agitation TEXT,
          impulsivity TEXT,
          motivation TEXT,
          medication_taken BOOLEAN,
          medication_time TEXT,
          medication_name TEXT,
          medication_dosage TEXT,
          medication_notes TEXT,
          medication_side_effects TEXT,
          sleep_hours INTEGER,
          sleep_quality TEXT,
          physical_activity BOOLEAN,
          tags TEXT,
          notes TEXT
        )`,
        [],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Save a mood entry
export function saveMoodEntry(entry: MoodEntry): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT OR REPLACE INTO mood_entries (
          id, date, mood, intensity, concentration, agitation,
          impulsivity, motivation, medication_taken, medication_time,
          medication_name, medication_dosage, medication_notes,
          medication_side_effects, sleep_hours, sleep_quality,
          physical_activity, tags, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.date,
          entry.mood,
          entry.intensity,
          entry.symptoms.concentration,
          entry.symptoms.agitation,
          entry.symptoms.impulsivity,
          entry.symptoms.motivation,
          entry.factors.medication.taken ? 1 : 0,
          entry.factors.medication.time,
          entry.factors.medication.name,
          entry.factors.medication.dosage,
          entry.factors.medication.notes,
          JSON.stringify(entry.factors.medication.sideEffects),
          entry.factors.sleep.hours,
          entry.factors.sleep.quality,
          entry.factors.physicalActivity ? 1 : 0,
          JSON.stringify(entry.factors.tags),
          entry.notes
        ],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Get all mood entries
export function getMoodEntries(): Promise<MoodEntry[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM mood_entries ORDER BY date DESC',
        [],
        (_, { rows: { _array } }) => {
          const entries = _array.map(row => ({
            id: row.id,
            date: row.date,
            mood: row.mood as MoodEntry['mood'],
            intensity: row.intensity,
            symptoms: {
              concentration: row.concentration as MoodEntry['symptoms']['concentration'],
              agitation: row.agitation as MoodEntry['symptoms']['agitation'],
              impulsivity: row.impulsivity as MoodEntry['symptoms']['impulsivity'],
              motivation: row.motivation as MoodEntry['symptoms']['motivation'],
            },
            factors: {
              medication: {
                taken: Boolean(row.medication_taken),
                time: row.medication_time,
                name: row.medication_name,
                dosage: row.medication_dosage,
                notes: row.medication_notes,
                sideEffects: JSON.parse(row.medication_side_effects || '[]'),
              },
              sleep: {
                hours: row.sleep_hours,
                quality: row.sleep_quality as MoodEntry['factors']['sleep']['quality'],
              },
              physicalActivity: Boolean(row.physical_activity),
              tags: JSON.parse(row.tags || '[]'),
            },
            notes: row.notes,
          }));
          resolve(entries);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Delete a mood entry
export function deleteMoodEntry(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM mood_entries WHERE id = ?',
        [id],
        () => resolve(),
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Get entries for a specific date range
export function getMoodEntriesForDateRange(startDate: string, endDate: string): Promise<MoodEntry[]> {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM mood_entries WHERE date BETWEEN ? AND ? ORDER BY date DESC',
        [startDate, endDate],
        (_, { rows: { _array } }) => {
          const entries = _array.map(row => ({
            id: row.id,
            date: row.date,
            mood: row.mood as MoodEntry['mood'],
            intensity: row.intensity,
            symptoms: {
              concentration: row.concentration as MoodEntry['symptoms']['concentration'],
              agitation: row.agitation as MoodEntry['symptoms']['agitation'],
              impulsivity: row.impulsivity as MoodEntry['symptoms']['impulsivity'],
              motivation: row.motivation as MoodEntry['symptoms']['motivation'],
            },
            factors: {
              medication: {
                taken: Boolean(row.medication_taken),
                time: row.medication_time,
                name: row.medication_name,
                dosage: row.medication_dosage,
                notes: row.medication_notes,
                sideEffects: JSON.parse(row.medication_side_effects || '[]'),
              },
              sleep: {
                hours: row.sleep_hours,
                quality: row.sleep_quality as MoodEntry['factors']['sleep']['quality'],
              },
              physicalActivity: Boolean(row.physical_activity),
              tags: JSON.parse(row.tags || '[]'),
            },
            notes: row.notes,
          }));
          resolve(entries);
        },
        (_, error) => {
          reject(error);
          return false;
        }
      );
    });
  });
}

// Initialize database when app starts
initDatabase().catch(error => {
  console.error('Database initialization failed:', error);
});