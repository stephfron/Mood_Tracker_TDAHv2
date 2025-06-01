import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TextInput, Alert, Platform } from 'react-native';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import { DEFAULT_REMINDER_SETTINGS, ReminderSettings, exportUserData, getReminderSettings, saveReminderSettings } from '@/utils/storage';
import { BellRing, Download, CircleHelp as HelpCircle, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(DEFAULT_REMINDER_SETTINGS);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getReminderSettings();
    setReminderSettings(settings);
  };

  const handleSaveSettings = async () => {
    await saveReminderSettings(reminderSettings);
    Alert.alert('Succès', 'Paramètres de rappel enregistrés');
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const data = await exportUserData();
      
      if (Platform.OS === 'web') {
        // For web, create a download file
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'moodtracker-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // For mobile, show the data in an alert or send to a sharing API
        Alert.alert('Données exportées', 'Fonction de partage à implémenter pour les appareils mobiles');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l\'exportation des données');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Paramètres</Text>

      <Card title="Rappels">
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BellRing size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Notifications de rappel</Text>
          </View>
          
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Activer les rappels</Text>
            <Switch
              trackColor={{ false: '#CBD5E1', true: Colors.light.tint }}
              thumbColor={'#FFFFFF'}
              ios_backgroundColor="#CBD5E1"
              onValueChange={(value) =>
                setReminderSettings({ ...reminderSettings, enabled: value })
              }
              value={reminderSettings.enabled}
            />
          </View>

          {reminderSettings.enabled && (
            <>
              <Text style={styles.label}>Heures de rappel</Text>
              <View style={styles.timeInputsContainer}>
                {reminderSettings.times.map((time, index) => (
                  <TextInput
                    key={index}
                    style={styles.timeInput}
                    value={time}
                    onChangeText={(newTime) => {
                      const newTimes = [...reminderSettings.times];
                      newTimes[index] = newTime;
                      setReminderSettings({ ...reminderSettings, times: newTimes });
                    }}
                    placeholder="HH:MM"
                  />
                ))}
                {reminderSettings.times.length < 3 && (
                  <Button
                    title="+ Ajouter"
                    type="text"
                    size="small"
                    onPress={() => {
                      setReminderSettings({
                        ...reminderSettings,
                        times: [...reminderSettings.times, '12:00'],
                      });
                    }}
                  />
                )}
              </View>

              <Text style={styles.label}>Message de rappel</Text>
              <TextInput
                style={styles.messageInput}
                value={reminderSettings.message}
                onChangeText={(message) =>
                  setReminderSettings({ ...reminderSettings, message })
                }
                placeholder="Message de notification"
                multiline
              />
            </>
          )}

          <Button
            title="Enregistrer les paramètres"
            onPress={handleSaveSettings}
            style={styles.saveButton}
          />
        </View>
      </Card>

      <Card title="Données">
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Download size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Exportation des données</Text>
          </View>
          
          <Text style={styles.description}>
            Exportez toutes vos données pour les sauvegarder ou les partager avec un professionnel de santé.
          </Text>
          
          <Button
            title="Exporter mes données"
            type="outline"
            onPress={handleExportData}
            loading={isExporting}
            style={styles.exportButton}
          />
        </View>
      </Card>

      <Card title="À propos">
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>À propos de l'application</Text>
          </View>
          
          <Text style={styles.description}>
            MoodTracker TDAH v1.0.0
          </Text>
          <Text style={styles.description}>
            Application conçue spécifiquement pour les adultes avec un TDAH afin de suivre leur humeur, symptômes et facteurs d'influence au quotidien.
          </Text>
        </View>
      </Card>

      <Card title="Aide">
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={20} color={Colors.light.tint} />
            <Text style={styles.sectionTitle}>Besoin d'aide ?</Text>
          </View>
          
          <Text style={styles.description}>
            Si vous avez besoin d'aide pour utiliser l'application ou si vous rencontrez des difficultés, n'hésitez pas à nous contacter.
          </Text>
          
          <Text style={styles.contactInfo}>
            support@moodtracker-tdah.com
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
  },
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    width: 80,
    fontFamily: 'Inter-Regular',
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    minHeight: 60,
    fontFamily: 'Inter-Regular',
  },
  saveButton: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
  exportButton: {
    marginTop: 8,
  },
  contactInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.tint,
    marginTop: 8,
  },
});