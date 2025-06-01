import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MoodType } from '@/types/mood';
import Colors from '@/constants/Colors';
import { Frown, Meh as MehIcon, Smile as SmileIcon, Smile as SmileyIcon, Frown as FrownIcon } from 'lucide-react-native';

interface MoodSelectorProps {
  selectedMood: MoodType;
  onSelectMood: (mood: MoodType) => void;
}

interface MoodOption {
  type: MoodType;
  label: string;
  icon: React.ReactNode;
}

export default function MoodSelector({ selectedMood, onSelectMood }: MoodSelectorProps) {
  const moodOptions: MoodOption[] = [
    {
      type: 'verySad',
      label: 'Très triste',
      icon: <FrownIcon size={32} color={Colors.light.moodColors.verySad} />,
    },
    {
      type: 'sad',
      label: 'Triste',
      icon: <Frown size={32} color={Colors.light.moodColors.sad} />,
    },
    {
      type: 'neutral',
      label: 'Neutre',
      icon: <MehIcon size={32} color={Colors.light.moodColors.neutral} />,
    },
    {
      type: 'happy',
      label: 'Content(e)',
      icon: <SmileIcon size={32} color={Colors.light.moodColors.happy} />,
    },
    {
      type: 'veryHappy',
      label: 'Très content(e)',
      icon: <SmileyIcon size={32} color={Colors.light.moodColors.veryHappy} />,
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
            <View style={styles.iconContainer}>{option.icon}</View>
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
  iconContainer: {
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