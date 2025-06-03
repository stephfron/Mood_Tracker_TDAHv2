import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Sun, Moon, Sparkles, Tag, Brain, Zap, Pill } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { MoodEntry, DEFAULT_MOOD_ENTRY } from '@/types/mood';
import { saveMoodEntry } from '@/utils/storage';

export default function HomeScreen() {
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    ...DEFAULT_MOOD_ENTRY,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });
  const [showDetails, setShowDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const timeOfDay = new Date().getHours() < 12 ? 'matin' : new Date().getHours() < 18 ? 'après-midi' : 'soir';
  const greetingIcon = timeOfDay === 'matin' ? Sun : timeOfDay === 'après-midi' ? Sparkles : Moon;
  const GreetingIcon = greetingIcon;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMoodEntry(moodEntry);
      setMoodEntry({
        ...DEFAULT_MOOD_ENTRY,
        id: Date.now().toString(),
        date: new Date().toISOString(),
      });
      setShowDetails(false);
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const moodOptions = [
    { emoji: '😟', type: 'verySad', color: Colors.light.moodColors.verySad },
    { emoji: '😕', type: 'sad', color: Colors.light.moodColors.sad },
    { emoji: '😐', type: 'neutral', color: Colors.light.moodColors.neutral },
    { emoji: '🙂', type: 'happy', color: Colors.light.moodColors.happy },
    { emoji: '😊', type: 'veryHappy', color: Colors.light.moodColors.veryHappy },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card gradient style={styles.header}>
        <View style={styles.greetingContainer}>
          <GreetingIcon size={32} color="#FFFFFF" />
          <View style={styles.greetingTextContainer}>
            <Text style={styles.greeting}>{`Bon ${timeOfDay} !`}</Text>
            <Text style={styles.dateInfo}>
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>
      </Card>

      <Card style={styles.mainCard}>
        <Text style={styles.mainQuestion}>Comment te sens-tu maintenant ?</Text>
        
        <View style={styles.moodSelector}>
          {moodOptions.map((option) => (
            <Pressable
              key={option.type}
              style={[
                styles.moodOption,
                { backgroundColor: `${option.color}20` },
                moodEntry.mood === option.type && styles.selectedMoodOption,
                moodEntry.mood === option.type && { borderColor: option.color }
              ]}
              onPress={() => setMoodEntry({ ...moodEntry, mood: option.type as any })}
            >
              <Text style={styles.moodEmoji}>{option.emoji}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.medicationSection}>
          <View style={styles.medicationHeader}>
            <Pill size={20} color={Colors.light.tint} />
            <Text style={styles.medicationTitle}>Suivi Médicament TDAH</Text>
          </View>
          <Text style={styles.medicationStatus}>
            {moodEntry.factors.medication.taken ? 'Médicament pris aujourd\'hui ✓' : 'Médicament non pris'}
          </Text>
          <View style={styles.medicationButtons}>
            <Button
              title="Pris"
              type={moodEntry.factors.medication.taken ? 'primary' : 'outline'}
              size="small"
              onPress={() => setMoodEntry({
                ...moodEntry,
                factors: {
                  ...moodEntry.factors,
                  medication: { ...moodEntry.factors.medication, taken: true }
                }
              })}
              style={styles.medicationButton}
            />
            <Button
              title="Non pris"
              type={!moodEntry.factors.medication.taken ? 'primary' : 'outline'}
              size="small"
              onPress={() => setMoodEntry({
                ...moodEntry,
                factors: {
                  ...moodEntry.factors,
                  medication: { ...moodEntry.factors.medication, taken: false }
                }
              })}
              style={styles.medicationButton}
            />
          </View>
        </View>

        {!showDetails ? (
          <Button
            title="+ Ajouter énergie, focus, notes..."
            type="outline"
            onPress={() => setShowDetails(true)}
            style={styles.addDetailsButton}
          />
        ) : (
          <View style={styles.detailsSection}>
            <View style={styles.detailsHeader}>
              <Brain size={20} color={Colors.light.tint} />
              <Text style={styles.detailsTitle}>Niveau d'énergie</Text>
            </View>
            <View style={styles.energySelector}>
              {['low', 'medium', 'high'].map((level) => (
                <Pressable
                  key={level}
                  style={[
                    styles.energyOption,
                    moodEntry.symptoms.motivation === level && styles.selectedEnergyOption
                  ]}
                  onPress={() => setMoodEntry({
                    ...moodEntry,
                    symptoms: { ...moodEntry.symptoms, motivation: level as any }
                  })}
                >
                  <Text style={[
                    styles.energyText,
                    moodEntry.symptoms.motivation === level && styles.selectedEnergyText
                  ]}>
                    {level === 'low' ? 'Faible' : level === 'medium' ? 'Moyen' : 'Élevé'}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Button
          title={showDetails ? "Enregistrer" : "Valider"}
          gradient
          onPress={handleSave}
          loading={isSaving}
          style={styles.saveButton}
        />
      </Card>
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
  },
  header: {
    marginBottom: 16,
    backgroundColor: Colors.light.tint,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingTextContainer: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  dateInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  mainCard: {
    marginBottom: 16,
  },
  mainQuestion: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedMoodOption: {
    borderWidth: 3,
  },
  moodEmoji: {
    fontSize: 32,
  },
  medicationSection: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  medicationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  medicationStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
    marginBottom: 12,
  },
  medicationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  medicationButton: {
    flex: 1,
  },
  addDetailsButton: {
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  energySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  energyOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
    alignItems: 'center',
  },
  selectedEnergyOption: {
    backgroundColor: Colors.light.selected,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  energyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedEnergyText: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  saveButton: {
    marginTop: 8,
  },
});