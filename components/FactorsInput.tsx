import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, ScrollView, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Card from './Card';
import { Clock, Moon, Zap, Tag } from 'lucide-react-native';

interface FactorsInputProps {
  medication: 'taken' | 'notTaken' | 'notApplicable';
  medicationTime?: string;
  sleepHours: number;
  sleepQuality?: 'good' | 'average' | 'poor';
  physicalActivity: boolean;
  tags: string[];
  onChangeMedication: (value: 'taken' | 'notTaken' | 'notApplicable') => void;
  onChangeMedicationTime: (time: string) => void;
  onChangeSleepHours: (hours: number) => void;
  onChangeSleepQuality: (quality: 'good' | 'average' | 'poor') => void;
  onChangePhysicalActivity: (value: boolean) => void;
  onChangeTags: (tags: string[]) => void;
}

export default function FactorsInput({
  medication,
  medicationTime,
  sleepHours,
  sleepQuality = 'average',
  physicalActivity,
  tags,
  onChangeMedication,
  onChangeMedicationTime,
  onChangeSleepHours,
  onChangeSleepQuality,
  onChangePhysicalActivity,
  onChangeTags,
}: FactorsInputProps) {
  const [newTag, setNewTag] = useState('');

  const sleepQualityOptions = [
    { value: 'good', label: 'Bien' },
    { value: 'average', label: 'Moyen' },
    { value: 'poor', label: 'Mauvais' },
  ];

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onChangeTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    onChangeTags(tags.filter((t) => t !== tag));
  };

  return (
    <ScrollView>
      <Card title="Facteurs d'influence">
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Médicament</Text>
          </View>
          <View style={styles.medicationOptions}>
            <Pressable
              style={[
                styles.medicationOption,
                medication === 'taken' && styles.selectedMedicationOption,
              ]}
              onPress={() => onChangeMedication('taken')}
            >
              <Text
                style={[
                  styles.medicationOptionText,
                  medication === 'taken' && styles.selectedMedicationOptionText,
                ]}
              >
                Pris
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.medicationOption,
                medication === 'notTaken' && styles.selectedMedicationOption,
              ]}
              onPress={() => onChangeMedication('notTaken')}
            >
              <Text
                style={[
                  styles.medicationOptionText,
                  medication === 'notTaken' && styles.selectedMedicationOptionText,
                ]}
              >
                Non pris
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.medicationOption,
                medication === 'notApplicable' && styles.selectedMedicationOption,
              ]}
              onPress={() => onChangeMedication('notApplicable')}
            >
              <Text
                style={[
                  styles.medicationOptionText,
                  medication === 'notApplicable' && styles.selectedMedicationOptionText,
                ]}
              >
                N/A
              </Text>
            </Pressable>
          </View>
          {medication === 'taken' && (
            <View style={styles.timeInput}>
              <Text style={styles.label}>Heure de prise :</Text>
              <TextInput
                style={styles.textInput}
                value={medicationTime}
                onChangeText={onChangeMedicationTime}
                placeholder="ex: 08:00"
                keyboardType="default"
              />
            </View>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Moon size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Sommeil</Text>
          </View>
          <View style={styles.sleepInput}>
            <Text style={styles.label}>Heures de sommeil :</Text>
            <TextInput
              style={styles.numberInput}
              value={sleepHours.toString()}
              onChangeText={(text) => {
                const hours = parseInt(text);
                if (!isNaN(hours) && hours >= 0 && hours <= 24) {
                  onChangeSleepHours(hours);
                }
              }}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>
          <View style={styles.qualitySelector}>
            <Text style={styles.label}>Qualité :</Text>
            <View style={styles.qualityOptions}>
              {sleepQualityOptions.map((option) => (
                <Pressable
                  key={option.value}
                  style={[
                    styles.qualityOption,
                    sleepQuality === option.value && styles.selectedQualityOption,
                  ]}
                  onPress={() => onChangeSleepQuality(option.value as any)}
                >
                  <Text
                    style={[
                      styles.qualityOptionText,
                      sleepQuality === option.value && styles.selectedQualityOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Activité Physique</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Activité aujourd'hui</Text>
            <Switch
              trackColor={{ false: '#CBD5E1', true: Colors.light.tint }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#CBD5E1"
              onValueChange={onChangePhysicalActivity}
              value={physicalActivity}
            />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Tag size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Tags</Text>
          </View>
          <View style={styles.tagsInput}>
            <TextInput
              style={styles.textInput}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Ajouter un tag (ex: travail, famille)"
              onSubmitEditing={handleAddTag}
            />
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <Pressable
                key={tag}
                style={styles.tag}
                onPress={() => handleRemoveTag(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 16,
  },
  medicationOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  medicationOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedMedicationOption: {
    backgroundColor: Colors.light.selected,
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  medicationOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedMedicationOptionText: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  timeInput: {
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  sleepInput: {
    marginBottom: 12,
  },
  numberInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 80,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  qualitySelector: {
    marginBottom: 8,
  },
  qualityOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  qualityOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedQualityOption: {
    backgroundColor: Colors.light.selected,
    borderColor: Colors.light.tint,
    borderWidth: 2,
  },
  qualityOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedQualityOptionText: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsInput: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.light.selected,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});