import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Button, Alert, Platform } from 'react-native'; // Added Button, Alert, Platform
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
// LineChart seems unused, can be removed if not planned for immediate use
// import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar as CalendarIcon, TrendingUp, Brain, Pill, Download } from 'lucide-react-native'; // Added Download icon
import Card from '@/components/Card';
import Colors from '@/constants/Colors';
import { getMoodEntries } from '@/utils/storage'; // Already here
import { MoodEntry } from '@/types/mood'; // Already here, MoodType might be unused directly in this file now

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const screenWidth = Dimensions.get('window').width - 32; // Used for LineChart, can be removed if chart is removed

type Period = 'week' | 'month' | '3months';

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  useEffect(() => {
    const loadEntries = async () => {
      const loadedEntries = await getStorageMoodEntries();
      // Sort by most recent first for display or processing
      setEntries(loadedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };
    loadEntries();
  }, []);

  const generateMoodEntriesHTML = (moodEntries: MoodEntry[]): string => {
    // Styles are embedded in the HTML string
    return `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; margin: 20px; color: #333; }
            h1 { text-align: center; color: #4A90E2; }
            .entry { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 8px; background-color: #f9f9f9; }
            .date { font-weight: bold; font-size: 1.2em; color: #4A90E2; margin-bottom: 8px; }
            .mood-info { margin-bottom: 5px; }
            .symptoms-info { margin-bottom: 5px; }
            .medications { margin-top: 10px; }
            .medication-item { margin-left: 15px; font-size: 0.9em; }
            .notes { margin-top: 10px; font-style: italic; color: #555; }
            ul { padding-left: 20px; }
            li { margin-bottom: 3px; }
          </style>
        </head>
        <body>
          <h1>Historique d'Humeur</h1>
          ${moodEntries.map(entry => `
            <div class="entry">
              <p class="date">Date: ${new Date(entry.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p class="mood-info">Humeur: ${entry.mood || 'N/A'} (Intensité: ${entry.intensity || 'N/A'})</p>
              <p class="symptoms-info">États Cognitifs: ${
                entry.symptoms ?
                Object.entries(entry.symptoms)
                  .filter(([_, value]) : SymptomLevel => value && typeof value === 'string' && !['normal', 'low', 'aucun', 'medium'].includes(value.toLowerCase())) // Filter out baseline/medium
                  .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                  .join(', ') || 'Aucun significatif'
                : 'N/A'
              }</p>
              ${entry.factors.medicationsTaken && entry.factors.medicationsTaken.length > 0 ? `
                <div class="medications">
                  <strong>Médicaments pris:</strong>
                  <ul>
                    ${entry.factors.medicationsTaken.map(med => `
                      <li>${med.name} (${med.dosage}, ${med.time || 'N/A'}) - Statut: ${med.status}</li>
                    `).join('')}
                  </ul>
                </div>
              ` : ''}
              ${entry.notes ? `<p class="notes">Note: ${entry.notes}</p>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;
  };

  const handleExportPDF = async () => {
    try {
      if (entries.length === 0) {
        Alert.alert("Export PDF", "Aucune donnée à exporter.");
        return;
      }

      const htmlContent = generateMoodEntriesHTML(entries);

      const options = {
        html: htmlContent,
        fileName: `MoodFlow_Historique_${new Date().toISOString().split('T')[0]}`,
        directory: Platform.OS === 'android' ? FileSystem.cacheDirectory : FileSystem.documentDirectory,
      };

      const file = await RNHTMLtoPDF.convert(options);

      if (Platform.OS !== 'web' && file.filePath) {
         if (await Sharing.isAvailableAsync()) {
           await Sharing.shareAsync(file.filePath, { mimeType: 'application/pdf', dialogTitle: 'Partager votre historique MoodFlow' });
         } else {
           Alert.alert("Partage non disponible", "Le partage n'est pas disponible sur cet appareil. PDF sauvegardé à: " + file.filePath);
         }
      } else if (file.filePath) { // For web or if sharing is not available but filePath exists
         Alert.alert("Export PDF", `PDF généré. Chemin (ou pour le web): ${file.filePath}`);
      } else {
         Alert.alert("Export PDF", "PDF généré, mais chemin non disponible.");
      }

    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      Alert.alert("Export PDF", "Une erreur est survenue lors de la génération du PDF.");
    }
  };

  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Historique et Tendances</Text>
          <Pressable onPress={handleExportPDF} style={styles.exportButton}>
            <Download size={24} color={Colors.dark.accentBlue} />
          </Pressable>
        </View>

        <View style={styles.periodSelector}>
          {(['week', 'month', '3months'] as Period[]).map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period === 'week' ? '7 jours' : 
                 period === 'month' ? '1 mois' : 
                 '3 mois'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Display basic list of entries for context - can be enhanced later */}
        {entries.length === 0 && (
          <Card style={styles.card}><Text style={styles.entryText}>Aucune entrée pour le moment.</Text></Card>
        )}
        {entries.map(entry => (
          <Card key={entry.id} style={styles.entryCard}>
            <Text style={styles.entryDate}>{new Date(entry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
            <Text style={styles.entryText}>Humeur: {entry.mood} (Int: {entry.intensity})</Text>
            {entry.notes && <Text style={styles.entryTextNotes}>Note: {entry.notes}</Text>}
          </Card>
        ))}

        {/* Original content commented out for brevity during PDF feature implementation */}
        {/* <Card style={styles.card}> ... Calendar ... </Card> */}
        {/* <Card style={styles.card}> ... Chart ... </Card> */}
        {/* <Card style={styles.card}> ... Insights ... </Card> */}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    // marginBottom: 20, // Handled by headerRow
  },
  exportButton: {
    padding: 8,
    // Basic styling, can be enhanced
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: Colors.dark.accentBlue,
  },
  periodButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.textSecondary,
  },
  periodButtonTextActive: {
    color: Colors.dark.textPrimary,
  },
  card: { // General card style, can be reused or specialized
    backgroundColor: Colors.dark.backgroundTertiary,
    marginBottom: 16,
    padding: 16, // Ensure Card component uses this or has its own padding
    borderRadius: 12, // Ensure Card component uses this or has its own radius
  },
  entryCard: { // Specific style for mood entry cards
    backgroundColor: Colors.dark.backgroundTertiary,
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
  },
  entryDate: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.dark.textEmphasis,
    marginBottom: 5,
  },
  entryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.dark.textPrimary,
    marginBottom: 3,
  },
  entryTextNotes: {
    fontFamily: 'Inter-Italic',
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textPrimary,
    marginLeft: 8,
  },
  chartPlaceholder: {
    height: 200,
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  chartPlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  insightItem: {
    backgroundColor: Colors.dark.backgroundPrimary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.textPrimary,
  },
});