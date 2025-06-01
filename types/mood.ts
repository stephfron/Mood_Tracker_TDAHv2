export type MoodType = 'verySad' | 'sad' | 'neutral' | 'happy' | 'veryHappy';
export type SymptomLevel = 'low' | 'medium' | 'high';

export interface MoodEntry {
  id: string;
  date: string; // ISO string
  mood: MoodType;
  intensity?: number; // 1-5
  symptoms: {
    concentration: SymptomLevel;
    agitation: SymptomLevel;
    impulsivity: SymptomLevel;
    motivation: SymptomLevel;
  };
  factors: {
    medication: 'taken' | 'notTaken' | 'notApplicable';
    medicationTime?: string;
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
    medication: 'notApplicable',
    sleep: {
      hours: 7,
      quality: 'average',
    },
    physicalActivity: false,
    tags: [],
  },
};