import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SymptomLevel } from '@/types/mood';
import Colors from '@/constants/Colors';

interface SymptomSelectorProps {
  title: string;
  selectedLevel: SymptomLevel;
  onSelectLevel: (level: SymptomLevel) => void;
}

interface LevelOption {
  value: SymptomLevel;
  label: string;
}

export default function SymptomSelector({
  title,
  selectedLevel,
  onSelectLevel,
}: SymptomSelectorProps) {
  const levelOptions: LevelOption[] = [
    { value: 'low', label: 'Faible' },
    { value: 'medium', label: 'Moyen' },
    { value: 'high', label: 'Élevé' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.optionsContainer}>
        {levelOptions.map((option) => (
          <Pressable
            key={option.value}
            style={[
              styles.option,
              styles[`${option.value}Option`],
              selectedLevel === option.value && styles.selectedOption,
              selectedLevel === option.value && styles[`${option.value}Selected`],
            ]}
            onPress={() => onSelectLevel(option.value)}
          >
            <Text
              style={[
                styles.optionLabel,
                selectedLevel === option.value && styles.selectedOptionLabel,
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
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  lowOption: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  mediumOption: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  highOption: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  selectedOption: {
    borderWidth: 2,
  },
  lowSelected: {
    borderColor: Colors.light.symptomLevels.low,
  },
  mediumSelected: {
    borderColor: Colors.light.symptomLevels.medium,
  },
  highSelected: {
    borderColor: Colors.light.symptomLevels.high,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  selectedOptionLabel: {
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
});