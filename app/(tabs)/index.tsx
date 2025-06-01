import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import MoodSelector from '@/components/MoodSelector';
import SymptomSelector from '@/components/SymptomSelector';
import FactorsInput from '@/components/FactorsInput';
import JournalInput from '@/components/JournalInput';
import Button from '@/components/Button';
import StatsCard from '@/components/StatsCard';
import Colors from '@/constants/Colors';
import { DEFAULT_MOOD_ENTRY, MoodEntry, UserStats } from '@/types/mood';
import { saveMoodEntry, getUserStats } from '@/utils/storage';

export default function HomeScreen() {
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    ...DEFAULT_MOOD_ENTRY,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });
  
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    longestStreak: 0,
    totalEntries: 0,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    const stats = await getUserStats();
    setUserStats(stats);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await saveMoodEntry(moodEntry);
      
      // Reset form with a new ID and current date
      setMoodEntry({
        ...DEFAULT_MOOD_ENTRY,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
      
      // Reload stats
      await loadUserStats();
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Comment allez-vous aujourd'hui ?</Text>
      <Text style={styles.subtitle}>
        Suivez votre humeur, vos symptômes TDAH et identifiez vos schémas.
      </Text>

      <StatsCard stats={userStats} />

      <MoodSelector
        selectedMood={moodEntry.mood}
        onSelectMood={(mood) => setMoodEntry({ ...moodEntry, mood })}
      />

      <View style={styles.symptomsContainer}>
        <Text style={styles.sectionTitle}>Symptômes TDAH</Text>
        
        <SymptomSelector
          title="Concentration"
          selectedLevel={moodEntry.symptoms.concentration}
          onSelectLevel={(level) =>
            setMoodEntry({
              ...moodEntry,
              symptoms: { ...moodEntry.symptoms, concentration: level },
            })
          }
        />
        
        <SymptomSelector
          title="Agitation"
          selectedLevel={moodEntry.symptoms.agitation}
          onSelectLevel={(level) =>
            setMoodEntry({
              ...moodEntry,
              symptoms: { ...moodEntry.symptoms, agitation: level },
            })
          }
        />
        
        <SymptomSelector
          title="Impulsivité"
          selectedLevel={moodEntry.symptoms.impulsivity}
          onSelectLevel={(level) =>
            setMoodEntry({
              ...moodEntry,
              symptoms: { ...moodEntry.symptoms, impulsivity: level },
            })
          }
        />
        
        <SymptomSelector
          title="Motivation"
          selectedLevel={moodEntry.symptoms.motivation}
          onSelectLevel={(level) =>
            setMoodEntry({
              ...moodEntry,
              symptoms: { ...moodEntry.symptoms, motivation: level },
            })
          }
        />
      </View>

      <FactorsInput
        medication={moodEntry.factors.medication}
        medicationTime={moodEntry.factors.medicationTime}
        sleepHours={moodEntry.factors.sleep.hours}
        sleepQuality={moodEntry.factors.sleep.quality}
        physicalActivity={moodEntry.factors.physicalActivity}
        tags={moodEntry.factors.tags}
        onChangeMedication={(medication) =>
          setMoodEntry({
            ...moodEntry,
            factors: { ...moodEntry.factors, medication },
          })
        }
        onChangeMedicationTime={(medicationTime) =>
          setMoodEntry({
            ...moodEntry,
            factors: { ...moodEntry.factors, medicationTime },
          })
        }
        onChangeSleepHours={(hours) =>
          setMoodEntry({
            ...moodEntry,
            factors: {
              ...moodEntry.factors,
              sleep: { ...moodEntry.factors.sleep, hours },
            },
          })
        }
        onChangeSleepQuality={(quality) =>
          setMoodEntry({
            ...moodEntry,
            factors: {
              ...moodEntry.factors,
              sleep: { ...moodEntry.factors.sleep, quality },
            },
          })
        }
        onChangePhysicalActivity={(physicalActivity) =>
          setMoodEntry({
            ...moodEntry,
            factors: { ...moodEntry.factors, physicalActivity },
          })
        }
        onChangeTags={(tags) =>
          setMoodEntry({
            ...moodEntry,
            factors: { ...moodEntry.factors, tags },
          })
        }
      />

      <JournalInput
        value={moodEntry.notes || ''}
        onChangeText={(notes) => setMoodEntry({ ...moodEntry, notes })}
      />

      {saveSuccess && (
        <View style={styles.successMessage}>
          <Text style={styles.successText}>Entrée enregistrée avec succès !</Text>
        </View>
      )}

      <Button
        title="Enregistrer"
        onPress={handleSave}
        loading={isSaving}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  symptomsContainer: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  saveButton: {
    marginTop: 24,
  },
  successMessage: {
    backgroundColor: Colors.light.success,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  successText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});