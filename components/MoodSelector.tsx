import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MoodType } from '@/types/mood';
import Colors from '@/constants/Colors';

interface MoodSelectorProps {
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  const moodOptions: MoodOption[] = [
    {
      type: 'verySad',
      label: 'Très triste',
      emoji: '😢',
    },
    {
      type: 'sad',
      label: 'Triste',
      emoji: '😕',
    },
    {
      type: 'neutral',
      label: 'Neutre',
      emoji: '😐',
    },
    {
      type: 'happy',
      label: 'Content(e)',
      emoji: '😊',
    },
    {
      type: 'veryHappy',
      label: 'Très content(e)',
      emoji: '😄',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comment vous sentez-vous ?</Text>
      <View style={styles.moodContainer}>
        {moodOptions.map((option) => (
          <Pressable
            key={option.type}
            style={[
              styles.moodOption,
              selectedMood === option.type && styles.selectedMoodOption,
            ]}
            onPress={() => onSelectMood(option.type)}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                selectedMood === option.type && styles.selectedMoodLabel,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    textAlign: 'center',
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodOption: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    width: '19%',
    borderRadius: 12,
    backgroundColor: Colors.light.backgroundSecondary,
  },
  selectedMoodOption: {
    backgroundColor: Colors.light.selected,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  emoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedMoodLabel: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
});