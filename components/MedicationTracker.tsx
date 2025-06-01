import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { Pill, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { MedicationDetails } from '@/types/mood';

interface MedicationTrackerProps {
  medication: MedicationDetails;
  onUpdate: (medication: MedicationDetails) => void;
}

const commonSideEffects = [
  'Perte d\'appétit',
  'Maux de tête',
  'Anxiété',
  'Insomnie',
  'Bouche sèche',
  'Nausées',
];

export default function MedicationTracker({ medication, onUpdate }: MedicationTrackerProps) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleSideEffect = (effect: string) => {
    const currentEffects = medication.sideEffects || [];
    const newEffects = currentEffects.includes(effect)
      ? currentEffects.filter(e => e !== effect)
      : [...currentEffects, effect];
    
    onUpdate({
      ...medication,
      sideEffects: newEffects,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pill size={20} color={Colors.light.tint} />
        <Text style={styles.title}>Suivi Médicament TDAH</Text>
      </View>

      <View style={styles.mainToggle}>
        <Pressable
          style={[styles.toggleButton, medication.taken && styles.toggleButtonActive]}
          onPress={() => onUpdate({ ...medication, taken: !medication.taken })}
        >
          <Text style={[styles.toggleText, medication.taken && styles.toggleTextActive]}>
            {medication.taken ? 'Médicament pris' : 'Médicament non pris'}
          </Text>
        </Pressable>
      </View>

      {medication.taken && (
        <>
          <View style={styles.timeSection}>
            <View style={styles.sectionHeader}>
              <Clock size={16} color={Colors.light.textSecondary} />
              <Text style={styles.sectionLabel}>Heure de prise</Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={medication.time}
              onChangeText={(time) => onUpdate({ ...medication, time })}
              placeholder="Ex: 08:00"
              keyboardType="numbers-and-punctuation"
            />
          </View>

          <Pressable
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails ? 'Masquer les détails' : 'Ajouter des détails'}
            </Text>
          </Pressable>

          {showDetails && (
            <View style={styles.details}>
              <TextInput
                style={styles.input}
                value={medication.name}
                onChangeText={(name) => onUpdate({ ...medication, name })}
                placeholder="Nom du médicament"
              />
              
              <TextInput
                style={styles.input}
                value={medication.dosage}
                onChangeText={(dosage) => onUpdate({ ...medication, dosage })}
                placeholder="Dosage (ex: 20mg)"
              />

              <View style={styles.sideEffectsSection}>
                <View style={styles.sectionHeader}>
                  <AlertCircle size={16} color={Colors.light.textSecondary} />
                  <Text style={styles.sectionLabel}>Effets secondaires</Text>
                </View>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  style={styles.sideEffectsScroll}
                >
                  {commonSideEffects.map((effect) => (
                    <Pressable
                      key={effect}
                      style={[
                        styles.sideEffectChip,
                        medication.sideEffects?.includes(effect) && styles.sideEffectChipActive
                      ]}
                      onPress={() => toggleSideEffect(effect)}
                    >
                      <Text style={[
                        styles.sideEffectText,
                        medication.sideEffects?.includes(effect) && styles.sideEffectTextActive
                      ]}>
                        {effect}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <TextInput
                style={[styles.input, styles.notesInput]}
                value={medication.notes}
                onChangeText={(notes) => onUpdate({ ...medication, notes })}
                placeholder="Notes additionnelles"
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  mainToggle: {
    marginBottom: 16,
  },
  toggleButton: {
    backgroundColor: Colors.light.backgroundSecondary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: Colors.light.selected,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.light.textSecondary,
  },
  toggleTextActive: {
    color: Colors.light.tint,
  },
  timeSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.textSecondary,
    marginLeft: 6,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  detailsToggle: {
    paddingVertical: 8,
  },
  detailsToggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.tint,
    textAlign: 'center',
  },
  details: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sideEffectsSection: {
    marginBottom: 12,
  },
  sideEffectsScroll: {
    marginBottom: 12,
  },
  sideEffectChip: {
    backgroundColor: Colors.light.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  sideEffectChipActive: {
    backgroundColor: Colors.light.selected,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  sideEffectText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  sideEffectTextActive: {
    color: Colors.light.tint,
    fontFamily: 'Inter-Medium',
  },
});