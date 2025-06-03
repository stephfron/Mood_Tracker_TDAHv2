import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Pill, Save, Smile, Zap, Brain, Frown, Meh, CircleAlert as AlertCircle, Target, Waves, Cloud, BatteryCharging, Lightbulb } from 'lucide-react-native';
import Colors from '@/constants/Colors';

type Mood = 'positive' | 'negative' | 'neutral' | 'anxious';
type CognitiveState = 'focused' | 'scattered' | 'foggy' | 'hyperactive' | 'tired' | 'creative';
interface Medication {
  id: string;
  name: string;
  dose: string;
  taken: boolean;
  isTaking?: boolean;
}

const initialMedications: Medication[] = [
  { id: '1', name: 'Ritaline', dose: '20mg - 8h00', taken: true },
  { id: '2', name: 'Ritaline', dose: '20mg - 12h00', taken: false, isTaking: true },
];

const moodOptions: { mood: Mood; emoji: string; label: string; icon?: React.FC<any> }[] = [
  { mood: 'positive', emoji: '😊', label: 'Positif', icon: Smile },
  { mood: 'negative', emoji: '😔', label: 'Morose', icon: Frown },
  { mood: 'neutral', emoji: '😌', label: 'Neutre', icon: Meh },
  { mood: 'anxious', emoji: '😰', label: 'Anxieux', icon: AlertCircle },
];

const cognitiveOptions: { state: CognitiveState; emoji: string; label: string; icon?: React.FC<any> }[] = [
  { state: 'focused', emoji: '🎯', label: 'Concentré', icon: Target },
  { state: 'scattered', emoji: '🌊', label: 'Dispersé', icon: Waves },
  { state: 'foggy', emoji: '☁️', label: 'Brumeux', icon: Cloud },
  { state: 'hyperactive', emoji: '⚡', label: 'Hyperactif', icon: Zap },
  { state: 'tired', emoji: '😴', label: 'Fatigué', icon: BatteryCharging },
  { state: 'creative', emoji: '💡', label: 'Créatif', icon: Lightbulb },
];

export default function HomeScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const [streak, setStreak] = useState(7);
  const [selectedMood, setSelectedMood] = useState<Mood>('neutral');
  const [selectedCognitiveStates, setSelectedCognitiveStates] = useState<CognitiveState[]>(['focused']);
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    setCurrentDate(today.toLocaleDateString('fr-FR', options));
  }, []);

  const toggleCognitiveState = (state: CognitiveState) => {
    setSelectedCognitiveStates(prev =>
      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
    );
  };

  const handleMedicationToggle = (id: string) => {
    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.id === id ? { ...med, taken: !med.taken, isTaking: med.isTaking ? false : undefined } : med
      )
    );
  };
  
  const handleSave = () => {
    console.log('Saving data:', { selectedMood, selectedCognitiveStates, medications, quickNote });
  };

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
          <Text style={styles.sectionTitle}>Comment vous sentez-vous ?</Text>
          <View style={styles.moodGrid}>
            {moodOptions.map(({ mood, emoji, label, icon: Icon }) => (
              <Pressable
                key={mood}
                style={[styles.moodItem, selectedMood === mood && styles.moodItemSelected]}
                onPress={() => setSelectedMood(mood)}
              >
                {Icon ? <Icon size={32} color={selectedMood === mood ? Colors.dark.accentBlue : Colors.dark.textSecondary} style={styles.moodEmojiAsIcon} /> : <Text style={styles.moodEmoji}>{emoji}</Text>}
                <Text style={[styles.moodLabel, selectedMood === mood && styles.moodLabelSelected]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>État cognitif</Text>
          <View style={styles.cognitiveGrid}>
            {cognitiveOptions.map(({ state, emoji, label, icon: Icon }) => (
              <Pressable
                key={state}
                style={[styles.cognitiveItem, selectedCognitiveStates.includes(state) && styles.cognitiveItemSelected]}
                onPress={() => toggleCognitiveState(state)}
              >
                {Icon ? <Icon size={24} color={selectedCognitiveStates.includes(state) ? Colors.dark.accentPurple : Colors.dark.textSecondary} style={styles.cognitiveEmojiAsIcon} /> : <Text style={styles.cognitiveEmoji}>{emoji}</Text>}
                <Text style={[styles.cognitiveLabel, selectedCognitiveStates.includes(state) && styles.cognitiveLabelSelected]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.section, styles.medicationSection]}>
          <View style={styles.medicationHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Pill size={20} color={Colors.dark.accentGreen} />
              <Text style={styles.medicationTitle}>Médication</Text>
            </View>
            <Pressable style={styles.addMedBtn}><Text style={styles.addMedBtnText}>+ Ajouter</Text></Pressable>
          </View>
          {medications.map(med => (
            <View key={med.id} style={styles.medicationItem}>
              <View style={styles.medInfo}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDose}>{med.dose}</Text>
              </View>
              <Pressable 
                style={[styles.medTakenBtn, med.taken ? {backgroundColor: Colors.dark.accentGreen} : med.isTaking ? {backgroundColor: Colors.dark.accentPurple} : {backgroundColor: Colors.dark.textSecondary}]}
                onPress={() => handleMedicationToggle(med.id)}
              >
                <Text style={styles.medBtnText}>{med.taken ? 'Pris ✓' : med.isTaking ? 'Prendre' : 'Non Pris'}</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note rapide (optionnel)</Text>
          <View style={styles.quickNote}>
            <TextInput 
              style={styles.quickNoteInput} 
              placeholder="Vos pensées ici..." 
              placeholderTextColor={Colors.dark.textSecondary} 
              multiline 
              value={quickNote} 
              onChangeText={setQuickNote}
            />
          </View>
        </View>
      </ScrollView>
      <Pressable style={styles.saveBtnContainer} onPress={handleSave}>
        <LinearGradient 
          colors={[Colors.dark.accentBlue, Colors.dark.accentPurple]} 
          style={styles.saveBtn}
        >
          <Save size={24} color={Colors.dark.textPrimary} />
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
    padding: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  greetingContainer: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 28,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  dateText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.selectedBackgroundGreen,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  streakText: {
    fontSize: 12,
    color: Colors.dark.accentGreen,
    marginLeft: 6,
    fontFamily: 'Inter-SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.dark.textEmphasis,
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodItem: {
    width: '48%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  moodItemSelected: {
    borderColor: Colors.dark.accentBlue,
    backgroundColor: Colors.dark.selectedBackgroundBlue,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodEmojiAsIcon: {
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    fontFamily: 'Inter-Medium',
  },
  moodLabelSelected: {
    color: Colors.dark.accentBlue,
  },
  cognitiveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cognitiveItem: {
    width: '31%',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderWidth: 2,
    borderColor: Colors.dark.borderPrimary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  cognitiveItemSelected: {
    borderColor: Colors.dark.accentPurple,
    backgroundColor: Colors.dark.selectedBackgroundPurple,
  },
  cognitiveEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  cognitiveEmojiAsIcon: {
    marginBottom: 6,
  },
  cognitiveLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  cognitiveLabelSelected: {
    color: Colors.dark.accentPurple,
  },
  medicationSection: {
    backgroundColor: Colors.dark.selectedBackgroundGreen,
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  medicationTitle: {
    fontSize: 16,
    color: Colors.dark.accentGreen,
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  addMedBtn: {
    backgroundColor: Colors.dark.selectedBackgroundGreen,
    borderColor: Colors.dark.borderAccentGreen,
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addMedBtnText: {
    color: Colors.dark.accentGreen,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    color: Colors.dark.textEmphasis,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  medDose: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  medTakenBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  medBtnText: {
    color: Colors.dark.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  quickNote: {
    backgroundColor: Colors.dark.backgroundTertiary,
    borderColor: Colors.dark.borderPrimary,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  quickNoteInput: {
    color: Colors.dark.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveBtnContainer: {
    position: 'absolute',
    bottom: 20,
    right: 24,
    zIndex: 1000,
  },
  saveBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Colors.dark.accentBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});