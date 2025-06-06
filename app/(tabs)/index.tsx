import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Pill, Save, Smile, Zap, Brain, Frown, Meh, Target, Waves, Cloud, BatteryCharging, CircleMinus as MinusCircle, Check, X } from 'lucide-react-native';
import {
  saveMoodEntry as saveStorageMoodEntry,
  getMoodEntries as getStorageMoodEntries,
  MoodEntry,
  getConfiguredMedications // Import new function
} from '../../utils/storage';
import {
  MoodType,
  SymptomLevel,
  DEFAULT_MOOD_ENTRY,
  MedicationTakenEntry, // This is the type for daily medication status
  ConfiguredMedication // This is the type for medication configuration
} from '../../types/mood';
import Colors from '@/constants/Colors';

type EmotionalStateKey = 'positif' | 'negatif' | 'neutre';
type CognitiveStateKey = 'concentre' | 'disperse' | 'brumeux' | 'hyperactif' | 'fatigue';
// type MedicationStatus = 'pris' | 'oublie' | 'partiel' | 'non_applicable'; // Removed, using imported MedicationStatus from types/mood.ts

interface EmotionalStateOption {
  key: EmotionalStateKey;
  label: string;
  icon: React.FC<any>;
  color: string;
}

interface CognitiveStateOption {
  key: CognitiveStateKey;
  label: string;
  icon: React.FC<any>;
  color: string;
}

// This local interface MedicationEntry is now effectively MedicationTakenEntry
// The state `medicationEntries` will hold items of type MedicationTakenEntry.
// The local MedicationEntry interface definition below is fully removed as MedicationTakenEntry is imported.
// interface MedicationEntry {
//   id: string;
//   name: string;
//   dosage: string;
//   time: string;
//   status: MedicationStatus;
// }

const ColorWithOpacity = (color: string, opacity: number): string => {
  if (color.startsWith('#') && color.length === 7) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } else if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  return color;
};

const emotionalStateOptions: EmotionalStateOption[] = [
  { key: 'positif', label: 'Positif/Optimiste', icon: Smile, color: Colors.dark.moodColors.positive },
  { key: 'negatif', label: 'Négatif/Morose', icon: Frown, color: Colors.dark.moodColors.negative },
  { key: 'neutre', label: 'Neutre/Stable', icon: Meh, color: Colors.dark.moodColors.neutral },
];

const cognitiveStateOptions: CognitiveStateOption[] = [
  { key: 'concentre', label: 'Concentré', icon: Target, color: Colors.dark.cognitiveColors.focused },
  { key: 'disperse', label: 'Dispersé', icon: Waves, color: Colors.dark.cognitiveColors.scattered },
  { key: 'brumeux', label: 'Brumeux', icon: Cloud, color: Colors.dark.cognitiveColors.foggy },
  { key: 'hyperactif', label: 'Hyperactif', icon: Zap, color: Colors.dark.cognitiveColors.hyperactive },
  { key: 'fatigue', label: 'Fatigué', icon: BatteryCharging, color: Colors.dark.cognitiveColors.tired },
];

// const initialMedicationEntries: MedicationEntry[] = [...] // This is removed

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(7);
  const [selectedEmotionalState, setSelectedEmotionalState] = useState<EmotionalStateKey>('neutre');
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [selectedCognitiveStates, setSelectedCognitiveStates] = useState<CognitiveStateKey[]>(['concentre']);
  const [medicationEntries, setMedicationEntries] = useState<MedicationTakenEntry[]>([]); // Use MedicationTakenEntry type
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('fr-FR', options));
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // Load configured medications to populate the daily checklist
    const configuredMeds = await getConfiguredMedications();
    const initialDailyMedStatus: MedicationTakenEntry[] = configuredMeds.map(cm => ({
      id: cm.id, // This ID comes from ConfiguredMedication
      name: cm.name,
      dosage: cm.dosage,
      time: cm.time || 'N/A',
      status: 'non_applicable'
    }));
    setMedicationEntries(initialDailyMedStatus);

    // Load the last saved mood entry to pre-fill other fields (optional, could be for today or just last)
    // For this subtask, the main goal is loading configured meds.
    // The logic to restore *today's* medication statuses from a saved entry if it's for the current day can be an enhancement.
    // The existing loadData logic for other fields (mood, symptoms, notes) from the last entry can remain or be adapted.
    // Let's rename the old `loadData` to `loadLastMoodEntryDetails` and call it.
    loadLastMoodEntryDetails(initialDailyMedStatus); // Pass initialDailyMedStatus to potentially merge/update
  };

  // This function now focuses on loading details from the *last mood entry* if it exists
  // and potentially overlaying medication statuses if the last entry was for today.
  const loadLastMoodEntryDetails = async (currentDayMedicationList: MedicationTakenEntry[]) => {
    const entries = await getStorageMoodEntries();
    if (entries && entries.length > 0) {
      const lastEntry = entries[entries.length - 1];

      // For simplicity, we'll pre-fill mood/symptoms/notes from the very last entry,
      // regardless of its date. A more advanced logic would check if lastEntry.date is today.
      let emotionalStateKey: EmotionalStateKey = 'neutre';
      if (lastEntry.mood === 'happy' || lastEntry.mood === 'veryHappy') emotionalStateKey = 'positif';
      else if (lastEntry.mood === 'sad' || lastEntry.mood === 'verySad') emotionalStateKey = 'negatif';
      setSelectedEmotionalState(emotionalStateKey);
      setMoodIntensity(lastEntry.intensity || 3);

      const loadedCognitiveStates: CognitiveStateKey[] = [];
      if (lastEntry.symptoms) {
        if (lastEntry.symptoms.concentration === 'high') loadedCognitiveStates.push('concentre');
        if (lastEntry.symptoms.concentration === 'low') loadedCognitiveStates.push('disperse');
        if (lastEntry.symptoms.agitation === 'high') loadedCognitiveStates.push('hyperactif');
      }
      setSelectedCognitiveStates(loadedCognitiveStates.length > 0 ? loadedCognitiveStates : []);
      setQuickNote(lastEntry.notes || '');

      // Medication status restoration:
      // If lastEntry.date is today, merge its medicationsTaken with currentDayMedicationList
      const lastEntryDate = new Date(lastEntry.date).toDateString();
      const todayDate = new Date().toDateString();

      if (lastEntryDate === todayDate && lastEntry.factors?.medicationsTaken) {
        const updatedMedEntries = currentDayMedicationList.map(configuredMed => {
          const savedMedStatus = lastEntry.factors.medicationsTaken?.find(takenMed => takenMed.id === configuredMed.id);
          return savedMedStatus ? { ...configuredMed, status: savedMedStatus.status } : configuredMed;
        });
        setMedicationEntries(updatedMedEntries);
      }
      // Else, the medicationEntries are already set from configuredMeds with 'non_applicable' status.
    }
  };

  const toggleCognitiveState = (stateKey: CognitiveStateKey) => {
    setSelectedCognitiveStates(prev =>
      prev.includes(stateKey) ? prev.filter(s => s !== stateKey) : [...prev, stateKey]
    );
  };

  const handleMedicationStatusChange = (id: string, newStatus: MedicationStatus) => {
    setMedicationEntries(prevMeds =>
      prevMeds.map(med => (med.id === id ? { ...med, status: newStatus } : med))
    );
  };

  const handleSaveEntry = async () => {
    // Map EmotionalStateKey to MoodType
    let moodType: MoodType = 'neutral';
    if (selectedEmotionalState === 'positif') moodType = 'happy';
    else if (selectedEmotionalState === 'negatif') moodType = 'sad';

    // Map EmotionalStateKey to MoodType (MoodType from types/mood.ts is more granular)
    let moodTypeValue: MoodType = 'neutral';
    if (selectedEmotionalState === 'positif') {
      moodTypeValue = moodIntensity >= 4 ? 'veryHappy' : 'happy';
    } else if (selectedEmotionalState === 'negatif') {
      moodTypeValue = moodIntensity >= 4 ? 'verySad' : 'sad';
    }

    // Map UI selectedCognitiveStates to MoodEntry['symptoms']
    const symptomsData: MoodEntry['symptoms'] = {
      concentration: 'medium', // Default
      agitation: 'medium',     // Default
      impulsivity: 'medium',   // Default
      motivation: 'medium',    // Default
    };
    if (selectedCognitiveStates.includes('concentre')) symptomsData.concentration = 'high';
    if (selectedCognitiveStates.includes('disperse') || selectedCognitiveStates.includes('brumeux')) symptomsData.concentration = 'low';
    if (selectedCognitiveStates.includes('hyperactif')) symptomsData.agitation = 'high';
    // 'fatigue' is not directly in symptoms structure, could be a note or new symptom field.

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      mood: moodTypeValue,
      intensity: moodIntensity,
      symptoms: symptomsData,
      factors: {
        // medicationsTaken is now an array of MedicationTakenEntry
        // The MedicationEntry type in index.tsx is compatible with MedicationTakenEntry
        medicationsTaken: medicationEntries,
        sleep: DEFAULT_MOOD_ENTRY.factors.sleep, // Use default or implement UI
        physicalActivity: DEFAULT_MOOD_ENTRY.factors.physicalActivity, // Use default or implement UI
        tags: DEFAULT_MOOD_ENTRY.factors.tags, // Use default or implement UI
      },
      notes: quickNote,
    };

    try {
      const success = await saveStorageMoodEntry(newEntry);
      if (success) {
        Alert.alert('Succès', 'Entrée enregistrée avec succès !');
        // Optionally, reload data or update UI state further
        // loadData(); // Could reload to show the entry if UI depends on it, but might be redundant
      } else {
        Alert.alert('Erreur', "Échec de l'enregistrement de l'entrée.");
      }
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert('Erreur', "Une erreur s'est produite lors de l'enregistrement.");
    }
  };

  const IntensitySelector: React.FC = () => (
    <View style={styles.intensityContainer}>
      <Text style={styles.intensityLabel}>Intensité (1-5): {moodIntensity}</Text>
      <View style={styles.intensityButtons}>
        {[1, 2, 3, 4, 5].map(val => (
          <Pressable
            key={val}
            style={[
              styles.intensityButton,
              moodIntensity === val && styles.intensityButtonSelected
            ]}
            onPress={() => setMoodIntensity(val)}
          >
            <Text style={[
              styles.intensityButtonText,
              moodIntensity === val && styles.intensityButtonTextSelected
            ]}>
              {val}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.appContainer}
    >
      <ScrollView
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Bonjour ! 👋</Text>
          </View>
          <Text style={styles.dateText}>{currentDate}</Text>
          <View style={styles.streakContainer}>
            <Flame size={16} color={Colors.dark.accentGreen} />
            <Text style={styles.streakText}>{streak} jours de suite</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quel est votre état émotionnel ?</Text>
          <View style={styles.moodGrid}>
            {emotionalStateOptions.map(({ key, label, icon: Icon, color }) => (
              <Pressable
                key={key}
                style={[
                  styles.moodItem,
                  selectedEmotionalState === key && {
                    borderColor: color,
                    backgroundColor: ColorWithOpacity(color, 0.25)
                  }
                ]}
                onPress={() => setSelectedEmotionalState(key)}
              >
                <Icon
                  size={36}
                  color={selectedEmotionalState === key ? color : Colors.dark.textSecondary}
                  style={styles.moodIcon}
                />
                <Text
                  style={[
                    styles.moodLabel,
                    selectedEmotionalState === key && {
                      color: color,
                      fontFamily: 'Inter-SemiBold'
                    }
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
          <IntensitySelector />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quel est votre état cognitif ?</Text>
          <View style={styles.cognitiveGrid}>
            {cognitiveStateOptions.map(({ key, label, icon: Icon, color }) => (
              <Pressable
                key={key}
                style={[
                  styles.cognitiveItem,
                  selectedCognitiveStates.includes(key) && {
                    borderColor: color,
                    backgroundColor: ColorWithOpacity(color, 0.25)
                  }
                ]}
                onPress={() => toggleCognitiveState(key)}
              >
                <Icon
                  size={28}
                  color={selectedCognitiveStates.includes(key) ? color : Colors.dark.textSecondary}
                  style={styles.cognitiveIcon}
                />
                <Text
                  style={[
                    styles.cognitiveLabel,
                    selectedCognitiveStates.includes(key) && {
                      color: color,
                      fontFamily: 'Inter-SemiBold'
                    }
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.medicationSection]}>
          <View style={styles.medicationHeader}>
            <View style={styles.medicationTitleContainer}>
              <Pill size={20} color={Colors.dark.accentGreen} />
              <Text style={styles.medicationTitle}>Suivi Médicamenteux</Text>
            </View>
            <Pressable
              style={styles.addMedBtn}
              onPress={() => {
                // For now, let's use a simple way to add a placeholder medication to the list for UI testing
                // This should eventually lead to a proper medication management interface
                const newMedId = `med_ui_${Date.now()}`; // Ensure UI-added meds have distinct IDs from configured ones
                const placeholderNewMed: MedicationTakenEntry = { // Use MedicationTakenEntry type from types/mood.ts
                    id: newMedId,
                    name: 'Nouveau Médicament (UI)',
                    dosage: '10mg',
                    time: '12:00',
                    status: 'non_applicable'
                };
                setMedicationEntries(prevMeds => [...prevMeds, placeholderNewMed]);
                Alert.alert("Médicament Ajouté (Test)", "Un médicament placeholder a été ajouté à la liste. L'interface de gestion complète est à implémenter.");
              }}
            >
              <Text style={styles.addMedBtnText}>+ Gérer</Text>
            </Pressable>
          </View>
          {medicationEntries.length === 0 ? (
            <Text style={styles.noMedicationText}>Aucun médicament configuré pour le suivi quotidien. Cliquez sur "+ Gérer" pour en ajouter.</Text>
          ) : (
            medicationEntries.map(med => (
              <View key={med.id} style={styles.medicationItemContainer}>
                <View style={styles.medInfo}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.medDose}>{med.dosage} - {med.time}</Text>
                </View>
                <View style={styles.medStatusButtons}>
                  <Pressable
                    onPress={() => handleMedicationStatusChange(med.id, 'pris')}
                    style={[styles.medStatusBtn, med.status === 'pris' && styles.medStatusBtnPris]}
                  >
                    <Check
                      size={18}
                      color={med.status === 'pris' ? Colors.dark.textPrimary : Colors.dark.accentGreen}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMedicationStatusChange(med.id, 'oublie')}
                    style={[styles.medStatusBtn, med.status === 'oublie' && styles.medStatusBtnOublie]}
                  >
                    <X
                      size={18}
                      color={med.status === 'oublie' ? Colors.dark.textPrimary : Colors.dark.accentRed}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => handleMedicationStatusChange(med.id, 'partiel')}
                    style={[styles.medStatusBtn, med.status === 'partiel' && styles.medStatusBtnPartiel]}
                  >
                    <MinusCircle
                      size={18}
                      color={med.status === 'partiel' ? Colors.dark.textPrimary : Colors.dark.accentOrange}
                    />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes rapides (optionnel)</Text>
          <View style={styles.quickNote}>
            <TextInput
              style={styles.quickNoteInput}
              placeholder="Vos pensées, événements, déclencheurs..."
              placeholderTextColor={Colors.dark.textSecondary}
              multiline
              value={quickNote}
              onChangeText={setQuickNote}
            />
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.saveBtnContainer} onPress={handleSaveEntry}>
        <LinearGradient
          colors={[Colors.dark.accentBlue, Colors.dark.accentPurple]}
          style={styles.saveBtn}
        >
          <Save size={28} color={Colors.dark.textPrimary} />
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
    paddingBottom: 130,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: insets.top,
  },
  greetingContainer: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.15),
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.accentGreen,
    marginLeft: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textEmphasis,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodItem: {
    width: '31%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 100,
    justifyContent: 'center',
  },
  moodIcon: {
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  intensityContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: 10,
  },
  intensityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 320,
  },
  intensityButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.borderPrimary,
    backgroundColor: Colors.dark.backgroundTertiary,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: Colors.dark.accentBlue,
    borderColor: Colors.dark.accentBlue,
  },
  intensityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textSecondary,
  },
  intensityButtonTextSelected: {
    color: Colors.dark.textPrimary,
  },
  cognitiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cognitiveItem: {
    width: '48%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 90,
    justifyContent: 'center',
  },
  cognitiveIcon: {
    marginBottom: 4,
  },
  cognitiveLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  medicationSection: {
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.08),
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.accentGreen,
    marginLeft: 8,
  },
  addMedBtn: {
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.2),
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addMedBtnText: {
    color: Colors.dark.accentGreen,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  medicationItemContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // A bit darker than backgroundTertiary for contrast
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  medInfo: {
    marginBottom: 8,
  },
  medName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textEmphasis,
    fontSize: 14,
  },
  medDose: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
  },
  medStatusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  medStatusBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.borderPrimary,
    marginHorizontal: 4, // provides spacing between buttons
    minWidth: 44, // Ensures tap target size
    alignItems: 'center',
    justifyContent: 'center',
  },
  medStatusBtnPris: {
    backgroundColor: Colors.dark.accentGreen,
    borderColor: Colors.dark.accentGreen,
  },
  medStatusBtnOublie: {
    backgroundColor: Colors.dark.accentRed,
    borderColor: Colors.dark.accentRed,
  },
  medStatusBtnPartiel: {
    backgroundColor: Colors.dark.accentOrange,
    borderColor: Colors.dark.accentOrange,
  },
  noMedicationText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingVertical: 10,
  },
  quickNote: {
          <Text style={styles.sectionTitle}>Notes rapides (optionnel)</Text>
          <View style={styles.quickNote}>
            <TextInput
              style={styles.quickNoteInput}
              placeholder="Vos pensées, événements, déclencheurs..."
              placeholderTextColor={Colors.dark.textSecondary}
              multiline
              value={quickNote}
              onChangeText={setQuickNote}
            />
          </View>
        </View>
      </ScrollView>

      <Pressable style={styles.saveBtnContainer} onPress={handleSaveEntry}>
        <LinearGradient
          colors={[Colors.dark.accentBlue, Colors.dark.accentPurple]}
          style={styles.saveBtn}
        >
          <Save size={28} color={Colors.dark.textPrimary} />
        </LinearGradient>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  mainContent: {
    padding: 20,
    paddingBottom: 130,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  greetingContainer: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: 10,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.15),
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.accentGreen,
    marginLeft: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textEmphasis,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodItem: {
    width: '31%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 100,
    justifyContent: 'center',
  },
  moodIcon: {
    marginBottom: 6,
  },
  moodLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  intensityContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: 10,
  },
  intensityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: 320,
  },
  intensityButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.borderPrimary,
    backgroundColor: Colors.dark.backgroundTertiary,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: Colors.dark.accentBlue,
    borderColor: Colors.dark.accentBlue,
  },
  intensityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textSecondary,
  },
  intensityButtonTextSelected: {
    color: Colors.dark.textPrimary,
  },
  cognitiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cognitiveItem: {
    width: '48%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
    minHeight: 90,
    justifyContent: 'center',
  },
  cognitiveIcon: {
    marginBottom: 4,
  },
  cognitiveLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  medicationSection: {
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.08),
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.accentGreen,
    marginLeft: 8,
  },
  addMedBtn: {
    backgroundColor: ColorWithOpacity(Colors.dark.accentGreen, 0.2),
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  addMedBtnText: {
    color: Colors.dark.accentGreen,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  medicationItemContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  medInfo: {
    marginBottom: 8,
  },
  medName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textEmphasis,
    fontSize: 14,
  },
  medDose: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
  },
  medStatusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  medStatusBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.borderPrimary,
    marginHorizontal: 4,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medStatusBtnPris: {
    backgroundColor: Colors.dark.accentGreen,
    borderColor: Colors.dark.accentGreen,
  },
  medStatusBtnOublie: {
    backgroundColor: Colors.dark.accentRed,
    borderColor: Colors.dark.accentRed,
  },
  medStatusBtnPartiel: {
    backgroundColor: Colors.dark.accentOrange,
    borderColor: Colors.dark.accentOrange,
  },
  quickNote: {
    backgroundColor: Colors.dark.backgroundTertiary,
    borderColor: Colors.dark.borderPrimary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  quickNoteInput: {
    color: Colors.dark.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000,
  },
  saveBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.dark.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});