import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Card from '@/components/Card';
import Colors from '@/constants/Colors';
import { getMoodEntries } from '@/utils/storage';
import { MoodEntry, MoodType } from '@/types/mood';

const screenWidth = Dimensions.get('window').width - 32;

const moodValues: Record<MoodType, number> = {
  verySad: 1,
  sad: 2,
  neutral: 3,
  happy: 4,
  veryHappy: 5,
};

const moodLabels: Record<MoodType, string> = {
  verySad: 'Très triste',
  sad: 'Triste',
  neutral: 'Neutre',
  happy: 'Content(e)',
  veryHappy: 'Très content(e)',
};

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const loadedEntries = await getMoodEntries();
    setEntries(loadedEntries);
    
    // Process data for calendar view
    const datesObject: any = {};
    
    loadedEntries.forEach((entry) => {
      const dateStr = entry.date.split('T')[0];
      const moodColor = Colors.light.moodColors[entry.mood];
      
      datesObject[dateStr] = {
        selected: true,
        selectedColor: moodColor,
      };
    });
    
    setMarkedDates(datesObject);
    
    // Process data for chart view (last 7 days)
    processChartData(loadedEntries);
  };

  const processChartData = (entries: MoodEntry[]) => {
    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Get last 7 days of entries
    const last7Days = sortedEntries.slice(-7);
    
    const labels = last7Days.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    const data = last7Days.map(entry => moodValues[entry.mood]);
    
    setChartData({
      labels,
      datasets: [{ data: data.length ? data : [0] }],
    });
  };

  const getMoodSummary = () => {
    if (entries.length === 0) return null;
    
    // Count occurrences of each mood
    const moodCounts: Record<MoodType, number> = {
      verySad: 0,
      sad: 0,
      neutral: 0,
      happy: 0,
      veryHappy: 0,
    };
    
    entries.forEach(entry => {
      moodCounts[entry.mood]++;
    });
    
    // Find the most common mood
    let maxCount = 0;
    let mostCommonMood: MoodType = 'neutral';
    
    (Object.keys(moodCounts) as MoodType[]).forEach(mood => {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostCommonMood = mood;
      }
    });
    
    return {
      mostCommonMood,
      totalEntries: entries.length,
      percentage: Math.round((maxCount / entries.length) * 100),
    };
  };

  const moodSummary = getMoodSummary();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Historique et Tendances</Text>
      
      {entries.length > 0 ? (
        <>
          <Card title="Calendrier d'humeur">
            <Calendar
              markedDates={markedDates}
              theme={{
                calendarBackground: Colors.light.cardBackground,
                textSectionTitleColor: Colors.light.text,
                selectedDayBackgroundColor: Colors.light.tint,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: Colors.light.tint,
                dayTextColor: Colors.light.text,
                textDisabledColor: Colors.light.textSecondary,
                dotColor: Colors.light.tint,
                selectedDotColor: '#FFFFFF',
                arrowColor: Colors.light.tint,
                monthTextColor: Colors.light.text,
              }}
            />
          </Card>

          {moodSummary && (
            <Card title="Résumé d'humeur">
              <Text style={styles.summaryText}>
                Votre humeur la plus fréquente est{' '}
                <Text style={styles.highlightText}>
                  {moodLabels[moodSummary.mostCommonMood]}
                </Text>{' '}
                ({moodSummary.percentage}% des entrées).
              </Text>
            </Card>
          )}

          <Card title="Tendance sur 7 jours">
            {chartData.labels.length > 0 ? (
              <LineChart
                data={chartData}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                  backgroundColor: Colors.light.cardBackground,
                  backgroundGradientFrom: Colors.light.cardBackground,
                  backgroundGradientTo: Colors.light.cardBackground,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(30, 41, 59, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: Colors.light.tint,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: Colors.light.border,
                  },
                }}
                bezier
                style={styles.chart}
                fromZero
                yAxisSuffix=""
                yAxisLabel=""
                yLabelsOffset={10}
                segments={5}
                formatYLabel={(value) => {
                  const numValue = parseInt(value);
                  switch (numValue) {
                    case 1: return 'Très triste';
                    case 2: return 'Triste';
                    case 3: return 'Neutre';
                    case 4: return 'Content(e)';
                    case 5: return 'Très content(e)';
                    default: return '';
                  }
                }}
              />
            ) : (
              <Text style={styles.noDataText}>
                Pas assez de données pour afficher le graphique.
              </Text>
            )}
          </Card>

          <Card title="Entrées récentes">
            {entries.slice(-5).reverse().map((entry) => (
              <View key={entry.id} style={styles.entryItem}>
                <View style={styles.entryHeader}>
                  <View
                    style={[
                      styles.moodIndicator,
                      { backgroundColor: Colors.light.moodColors[entry.mood] },
                    ]}
                  />
                  <Text style={styles.entryDate}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.entryMood}>{moodLabels[entry.mood]}</Text>
                <View style={styles.symptomsContainer}>
                  {Object.entries(entry.symptoms).map(([key, value]) => (
                    <View key={key} style={styles.symptomItem}>
                      <Text style={styles.symptomLabel}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </Text>
                      <Text style={styles.symptomValue}>{value}</Text>
                    </View>
                  ))}
                </View>
                {entry.notes && (
                  <Text style={styles.entryNotes} numberOfLines={2}>
                    {entry.notes}
                  </Text>
                )}
              </View>
            ))}
          </Card>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Pas encore d'entrées</Text>
          <Text style={styles.emptyStateText}>
            Commencez à suivre votre humeur pour voir vos tendances apparaître ici.
          </Text>
        </View>
      )}
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
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
  highlightText: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.tint,
  },
  entryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  entryDate: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  entryMood: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  symptomItem: {
    flexDirection: 'row',
    marginRight: 16,
    marginBottom: 4,
  },
  symptomLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
    marginRight: 4,
  },
  symptomValue: {
    fontSize: 14,
    color: Colors.light.text,
    fontFamily: 'Inter-Medium',
  },
  entryNotes: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  noDataText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
    padding: 16,
  },
});