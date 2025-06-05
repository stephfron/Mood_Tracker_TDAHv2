import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { Plus, Trash2, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { ConfiguredMedication } from '@/types/mood';
import { saveConfiguredMedications } from '@/utils/storage';

interface MedicationManagerProps {
  medications: ConfiguredMedication[];
  onSave: (medications: ConfiguredMedication[]) => void;
  onClose: () => void;
}

export default function MedicationManager({ medications, onSave, onClose }: MedicationManagerProps) {
  const [localMedications, setLocalMedications] = useState<ConfiguredMedication[]>(medications);
  const [newMedication, setNewMedication] = useState<Partial<ConfiguredMedication>>({
    name: '',
    dosage: '',
    time: ''
  });

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage) {
      Alert.alert('Erreur', 'Le nom et le dosage sont requis.');
      return;
    }

    const newMed: ConfiguredMedication = {
      id: `med_${Date.now()}`,
      name: newMedication.name,
      dosage: newMedication.dosage,
      time: newMedication.time || '08:00'
    };

    setLocalMedications([...localMedications, newMed]);
    setNewMedication({ name: '', dosage: '', time: '' });
  };

  const handleDeleteMedication = (id: string) => {
    Alert.alert(
      'Supprimer le médicament',
      'Êtes-vous sûr de vouloir supprimer ce médicament ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setLocalMedications(localMedications.filter(med => med.id !== id));
          }
        }
      ]
    );
  };

  const handleSave = async () => {
    try {
      await saveConfiguredMedications(localMedications);
      onSave(localMedications);
      Alert.alert('Succès', 'Médicaments sauvegardés avec succès.');
    } catch (error) {
      console.error('Error saving medications:', error);
      Alert.alert('Erreur', 'Erreur lors de la sauvegarde des médicaments.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gérer les Médicaments</Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <X size={24} color={Colors.dark.textSecondary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Ajouter un médicament</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Nom du médicament"
              placeholderTextColor={Colors.dark.textSecondary}
              value={newMedication.name}
              onChangeText={(text) => setNewMedication({ ...newMedication, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (ex: 10mg)"
              placeholderTextColor={Colors.dark.textSecondary}
              value={newMedication.dosage}
              onChangeText={(text) => setNewMedication({ ...newMedication, dosage: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Heure (ex: 08:00)"
              placeholderTextColor={Colors.dark.textSecondary}
              value={newMedication.time}
              onChangeText={(text) => setNewMedication({ ...newMedication, time: text })}
            />
            <Pressable style={styles.addButton} onPress={handleAddMedication}>
              <Plus size={20} color={Colors.dark.textPrimary} />
              <Text style={styles.addButtonText}>Ajouter</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Médicaments configurés</Text>
          {localMedications.length === 0 ? (
            <Text style={styles.emptyText}>Aucun médicament configuré</Text>
          ) : (
            localMedications.map((med) => (
              <View key={med.id} style={styles.medicationItem}>
                <View style={styles.medicationInfo}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetails}>
                    {med.dosage} - {med.time}
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMedication(med.id)}
                >
                  <Trash2 size={20} color={Colors.dark.accentRed} />
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Sauvegarder</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderPrimary,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  addSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textPrimary,
    marginBottom: 12,
  },
  inputGroup: {
    gap: 12,
  },
  input: {
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.textPrimary,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accentBlue,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: Colors.dark.textPrimary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  listSection: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.dark.textSecondary,
    fontFamily: 'Inter-Regular',
    marginTop: 20,
  },
  medicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundTertiary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textPrimary,
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.borderPrimary,
  },
  saveButton: {
    backgroundColor: Colors.dark.accentGreen,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.dark.textPrimary,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});