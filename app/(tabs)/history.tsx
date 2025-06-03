import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Platform } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar as CalendarIcon, TrendingUp, Brain, Pill } from 'lucide-react-native';
import IconButton from '@/components/IconButton';
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

type Period = 'week' | 'month' | '3months';

export default function HistoryScreen() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [markedDates, setMarkedDates] = useState<any>({});
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [moodDistribution, setMoodDistribution] = useState<Record<MoodType, number>>({
    verySad: 0,
    sad: 0,
    neutral: 0,
    happy: 0,
    veryHappy: 0,
  });
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      processDataForPeriod(selectedPeriod);
    }
  }, [entries, selectedPeriod]);

  const loadEntries = async () => {
    const loadedEntries = await getMoodEntries();
    setEntries(loadedEntries);
  };

  const processDataForPeriod = (period: Period) => {
    const now = new Date();
    const periodStart = new Date();
    
    switch (period) {
      case 'week':
        periodStart.setDate(now.getDate() - 7);
        break;
      case 'month':
        periodStart.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        periodStart.setMonth(now.getMonth() - 3);
        break;
    }

    const filteredEntries = entries.filter(entry => 
      new Date(entry.date) >= periodStart && new Date(entry.date) <= now
    );

    // Process calendar marks
    const datesObject: any = {};
    filteredEntries.forEach((entry) => {
      const dateStr = entry.date.split('T')[0];
      datesObject[dateStr] = {
        selected: true,
        selectedColor: Colors.light.moodColors[entry.mood],
      };
    });
    setMarkedDates(datesObject);

    // Process chart data
    const sortedEntries = [...filteredEntries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    const data = sortedEntries.map(entry => moodValues[entry.mood]);

    setChartData({
      labels: labels.slice(-7), // Show last 7 points
      datasets: [{ data: data.slice(-7) }],
    });

    // Calculate mood distribution
    const distribution: Record<MoodType, number> = {
      verySad: 0,
      sad: 0,
      neutral: 0,
      happy: 0,
      veryHappy: 0,
    };

    filteredEntries.forEach(entry => {
      distribution[entry.mood]++;
    });

    setMoodDistribution(distribution);

    // Generate insights
    generateInsights(filteredEntries);
  };

  const generateInsights = (periodEntries: MoodEntry[]) => {
    const newInsights: string[] = [];

    // Streak calculation
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasEntry = periodEntries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (currentStreak > 0) {
      newInsights.push(`🎯 Série actuelle : ${currentStreak} jour${currentStreak > 1 ? 's' : ''} consécutif${currentStreak > 1 ? 's' : ''}`);
    }

    // Medication adherence
    const medicationEntries = periodEntries.filter(entry => entry.factors.medication.taken);
    const medicationAdherence = (medicationEntries.length / periodEntries.length) * 100;
    
    if (medicationAdherence >= 80) {
      newInsights.push('💊 Excellente adhérence au traitement !');
    } else if (medicationAdherence >= 50) {
      newInsights.push('💊 Pensez à prendre votre traitement régulièrement');
    }

    // Most common mood
    const moodCounts = Object.entries(moodDistribution)
      .sort(([, a], [, b]) => b - a);
    
    if (moodCounts[0][1] > 0) {
      newInsights.push(`🎭 Humeur la plus fréquente : ${moodLabels[moodCounts[0][0] as MoodType]}`);
    }

    setInsights(newInsights);
  };

  const renderChart = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webChartPlaceholder}>
          <Text style={styles.webChartText}>
            Le graphique d'évolution n'est pas disponible sur la version web.
          </Text>
        </View>
      );
    }

    return (
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
        }}
        bezier
        style={styles.chart}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
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
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique et Tendances</Text>
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
      </View>

      <Card>
        <View style={styles.sectionHeader}>
          <CalendarIcon size={20} color={Colors.light.tint} />
          <Text style={styles.sectionTitle}>Calendrier d'humeur</Text>
        </View>
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

      <Card>
        <View style={styles.sectionHeader}>
          <TrendingUp size={20} color={Colors.light.tint} />
          <Text style={styles.sectionTitle}>Évolution de l'humeur</Text>
        </View>
        {renderChart()}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Brain size={20} color={Colors.light.tint} />
          <Text style={styles.sectionTitle}>Aperçus</Text>
        </View>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightItem}>
            <Text style={styles.insightText}>{insight}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Pill size={20} color={Colors.light.tint} />
          <Text style={styles.sectionTitle}>Répartition des humeurs</Text>
        </View>
        {Object.entries(moodDistribution).map(([mood, count]) => {
          const percentage = entries.length > 0 ? (count / entries.length) * 100 : 0;
          return (
            <View key={mood} style={styles.distributionItem}>
              <View style={styles.distributionLabel}>
                <Text style={styles.distributionText}>
                  {moodLabels[mood as MoodType]}
                </Text>
                <Text style={styles.distributionCount}>
                  {count} ({percentage.toFixed(1)}%)
                </Text>
              </View>
              <View style={styles.distributionBarContainer}>
                <View
                  style={[
                    styles.distributionBar,
                    {
                      width: `${percentage}%`,
                      backgroundColor: Colors.light.moodColors[mood as MoodType],
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
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
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  periodButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.textSecondary,
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  webChartPlaceholder: {
    height: 220,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  webChartText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  insightItem: {
    backgroundColor: Colors.light.selected,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  insightText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  distributionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
  distributionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.textSecondary,
  },
  distributionBarContainer: {
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 4,
  },
});