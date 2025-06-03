import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Pill, Save, Smile, Zap, Brain, Frown, Meh, Target, Waves, Cloud, BatteryCharging, CircleMinus as MinusCircle, Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type EmotionalStateKey = 'positif' | 'negatif' | 'neutre';
type CognitiveStateKey = 'concentre' | 'disperse' | 'brumeux' | 'hyperactif' | 'fatigue';
type MedicationStatus = 'pris' | 'oublie' | 'partiel' | 'non_applicable';

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

interface MedicationEntry {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: MedicationStatus;
}

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

const initialMedicationEntries: MedicationEntry[] = [
  { id: 'med1', name: 'Methylphenidate (Ritaline)', dosage: '20mg', time: '08:00', status: 'pris' },
  { id: 'med2', name: 'Lisdexamfétamine (Elvanse)', dosage: '30mg', time: '08:30', status: 'non_applicable' },
];

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(7);
  const [selectedEmotionalState, setSelectedEmotionalState] = useState<EmotionalStateKey>('neutre');
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [selectedCognitiveStates, setSelectedCognitiveStates] = useState<CognitiveStateKey[]>(['concentre']);
  const [medicationEntries, setMedicationEntries] = useState<MedicationEntry[]>(initialMedicationEntries);
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('fr-FR', options));
  }, []);

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

  const handleSaveEntry = () => {
    console.log('Save Entry Action');
    // TODO: Implement AsyncStorage save
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
                Alert.alert("Gérer Médicaments", "Interface de gestion à implémenter.");
              }}
            >
              <Text style={styles.addMedBtnText}>+ Gérer</Text>
            </Pressable>
          </View>
          {medicationEntries.map(med => (
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
          ))}
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