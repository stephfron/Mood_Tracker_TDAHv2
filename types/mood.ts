export type MoodType = 'verySad' | 'sad' | 'neutral' | 'happy' | 'veryHappy';
export type SymptomLevel = 'low' | 'medium' | 'high';
export type MedicationStatus = 'pris' | 'oublie' | 'partiel' | 'non_applicable';

// Represents a medication that the user has configured in their settings
export interface ConfiguredMedication {
  id: string; // Unique ID for this configured medication
  name: string;
  dosage: string; // Default or common dosage
  time?: string;   // Default or common time (e.g., "08:00")
}

// Represents an instance of a configured medication taken (or not) on a specific day
export interface MedicationTakenEntry {
  id: string; // Corresponds to ConfiguredMedication.id to link back to the configuration
  name: string; // Copied from ConfiguredMedication for convenience at the time of entry
  dosage: string; // Copied from ConfiguredMedication
  time: string;   // Actual or scheduled time for this entry, might differ from config default
  status: MedicationStatus;
}

// Commenting out old MedicationDetails, replace with MedicationTakenEntry array in Factors
// export interface MedicationDetails {
//   taken: boolean;
//   time?: string;
//   name?: string;
//   dosage?: string;
//   notes?: string;
//   sideEffects?: string[];
// }

export interface MoodEntry {
  id: string;
  date: string; // ISO string
  mood: MoodType;
  intensity?: number; // 1-5
  symptoms: { // This structure will be used for cognitive states mapping
    concentration: SymptomLevel; // e.g. from 'concentre', 'disperse', 'brumeux'
    agitation: SymptomLevel;     // e.g. from 'hyperactif'
    impulsivity: SymptomLevel;   // No direct UI mapping yet
    motivation: SymptomLevel;    // No direct UI mapping yet
    // Consider adding 'energyLevel' if 'fatigue' needs to be stored here
  };
  factors: {
    // medication: MedicationDetails; // Old structure replaced
    medicationsTaken?: MedicationTakenEntry[]; // New structure for daily medication log
    sleep: {
      hours: number;
      quality?: 'good' | 'average' | 'poor';
    };
    physicalActivity: boolean;
    tags: string[];
  };
  notes?: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
}

export const DEFAULT_MOOD_ENTRY: MoodEntry = {
  id: '',
  date: new Date().toISOString(),
  mood: 'neutral',
  intensity: 3,
  symptoms: {
    concentration: 'medium',
    agitation: 'medium',
    impulsivity: 'medium',
    motivation: 'medium',
  },
  factors: {
    // medication field is removed, medicationsTaken is optional (default will be undefined)
    sleep: {
      hours: 7,
      quality: 'average',
    },
    physicalActivity: false,
    tags: [],
  },
  // factors.medication is removed, factors.medicationsTaken is optional so not needed for default if empty
};

// Reminder settings types (moved from utils/storage.ts for centralization)
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