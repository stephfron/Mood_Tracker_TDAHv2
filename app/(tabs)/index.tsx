import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { Sun, Moon, Sparkles, Tag, Brain, Zap } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import MoodSelector from '@/components/MoodSelector';
import SymptomSelector from '@/components/SymptomSelector';
import MedicationTracker from '@/components/MedicationTracker';
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
  const [newTag, setNewTag] = useState('');

  const timeOfDay = new Date().getHours() < 12 ? 'matin' : new Date().getHours() < 18 ? 'après-midi' : 'soir';
  const greetingIcon = timeOfDay === 'matin' ? Sun : timeOfDay === 'après-midi' ? Sparkles : Moon;
  const GreetingIcon = greetingIcon;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMoodEntry(moodEntry);
      // Reset form
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

  const handleAddTag = () => {
    if (newTag.trim() && !moodEntry.factors.tags.includes(newTag.trim())) {
      setMoodEntry({
        ...moodEntry,
        factors: {
          ...moodEntry.factors,
          tags: [...moodEntry.factors.tags, newTag.trim()]
        }
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMoodEntry({
      ...moodEntry,
      factors: {
        ...moodEntry.factors,
        tags: moodEntry.factors.tags.filter(tag => tag !== tagToRemove)
      }
    });
  };

  const predefinedTags = ['Travail', 'Études', 'Famille', 'Amis', 'Repos', 'Exercice', 'Procrastination'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <GreetingIcon size={32} color={Colors.light.tint} style={styles.greetingIcon} />
          <Text style={styles.greeting}>Bon {timeOfDay} !</Text>
        </View>
      </View>

      <Card style={styles.mainCard}>
        <Text style={styles.mainQuestion}>Comment te sens-tu maintenant ?</Text>
        <MoodSelector
          selectedMood={moodEntry.mood}
          onSelectMood={(mood) => setMoodEntry({ ...moodEntry, mood })}
        />
        
        <MedicationTracker
          medication={moodEntry.factors.medication}
          onUpdate={(medication) => setMoodEntry({
            ...moodEntry,
            factors: { ...moodEntry.factors, medication }
          })}
        />

        {!showDetails && (
          <Button
            title="Ajouter plus de détails"
            type="outline"
            onPress={() => setShowDetails(true)}
            style={styles.detailsButton}
          />
        )}

        {showDetails && (
          <View style={styles.detailsContainer}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Brain size={20} color={Colors.light.tint} />
                <Text style={styles.sectionTitle}>Symptômes TDAH</Text>
              </View>
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
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Zap size={20} color={Colors.light.tint} />
                <Text style={styles.sectionTitle}>Niveau d'énergie</Text>
              </View>
              <View style={styles.energyContainer}>
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

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Tag size={20} color={Colors.light.tint} />
                <Text style={styles.sectionTitle}>Contexte</Text>
              </View>
              <View style={styles.tagsContainer}>
                {predefinedTags.map((tag) => (
                  <Pressable
                    key={tag}
                    style={[
                      styles.tag,
                      moodEntry.factors.tags.includes(tag) && styles.selectedTag
                    ]}
                    onPress={() => {
                      if (moodEntry.factors.tags.includes(tag)) {
                        handleRemoveTag(tag);
                      } else {
                        handleAddTag();
                        setMoodEntry({
                          ...moodEntry,
                          factors: {
                            ...moodEntry.factors,
                            tags: [...moodEntry.factors.tags, tag]
                          }
                        });
                      }
                    }}
                  >
                    <Text style={[
                      styles.tagText,
                      moodEntry.factors.tags.includes(tag) && styles.selectedTagText
                    ]}>
                      {tag}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.customTagContainer}>
                <TextInput
                  style={styles.customTagInput}
                  value={newTag}
                  onChangeText={setNewTag}
                  placeholder="Ajouter un tag personnalisé"
                  onSubmitEditing={handleAddTag}
                />
              </View>
            </View>

            <View style={styles.section}>
              <TextInput
                style={styles.notesInput}
                multiline
                numberOfLines={4}
                placeholder="Notes personnelles (optionnel)"
                value={moodEntry.notes}
                onChangeText={(text) => setMoodEntry({ ...moodEntry, notes: text })}
              />
            </View>
          </View>
        )}

        <Button
          title={showDetails ? "Enregistrer" : "Valider"}
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
  header: {
    padding: 16,
    paddingTop: 24,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingIcon: {
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  mainCard: {
    margin: 16,
    marginTop: 0,
  },
  mainQuestion: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsButton: {
    marginTop: 16,
  },
  detailsContainer: {
    marginTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  energyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedTag: {
    backgroundColor: Colors.light.selected,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedTagText: {
    color: Colors.light.tint,
    fontFamily: 'Inter-Medium',
  },
  customTagContainer: {
    marginTop: 8,
  },
  customTagInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 24,
  },
});