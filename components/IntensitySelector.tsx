import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors'; // Assuming Colors are used for styling

interface IntensitySelectorProps {
  moodIntensity: number;
  onIntensityChange: (intensity: number) => void;
}

const IntensitySelector: React.FC<IntensitySelectorProps> = ({ moodIntensity, onIntensityChange }) => (
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
          onPress={() => onIntensityChange(val)}
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

const styles = StyleSheet.create({
  intensityContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  intensityLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary, // Adjusted to likely path
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
    borderColor: Colors.dark.borderPrimary, // Adjusted to likely path
    backgroundColor: Colors.dark.backgroundTertiary, // Adjusted to likely path
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityButtonSelected: {
    backgroundColor: Colors.dark.accentBlue, // Adjusted to likely path
    borderColor: Colors.dark.accentBlue, // Adjusted to likely path
  },
  intensityButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textSecondary, // Adjusted to likely path
  },
  intensityButtonTextSelected: {
    color: Colors.dark.textPrimary, // Adjusted to likely path
  },
});

export default IntensitySelector;
