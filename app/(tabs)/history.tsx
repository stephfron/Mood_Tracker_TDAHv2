import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Calendar as CalendarIcon, TrendingUp, Brain, Pill } from 'lucide-react-native';
import Card from '@/components/Card';
import Colors from '@/constants/Colors';
import { getMoodEntries } from '@/utils/storage';
import { MoodEntry, MoodType } from '@/types/mood';

const screenWidth = Dimensions.get('window').width - 32;

type Period = 'week' | 'month' | '3months';

export default function HistoryScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');

  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
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

        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <CalendarIcon size={20} color={Colors.dark.accentBlue} />
            <Text style={styles.sectionTitle}>Calendrier d'humeur</Text>
          </View>
          <Calendar
            theme={{
              backgroundColor: Colors.dark.backgroundPrimary,
              calendarBackground: Colors.dark.backgroundTertiary,
              textSectionTitleColor: Colors.dark.textPrimary,
              selectedDayBackgroundColor: Colors.dark.accentBlue,
              selectedDayTextColor: Colors.dark.textPrimary,
              todayTextColor: Colors.dark.accentBlue,
              dayTextColor: Colors.dark.textPrimary,
              textDisabledColor: Colors.dark.textSecondary,
              dotColor: Colors.dark.accentBlue,
              selectedDotColor: Colors.dark.textPrimary,
              arrowColor: Colors.dark.accentBlue,
              monthTextColor: Colors.dark.textPrimary,
              textMonthFontFamily: 'Inter-SemiBold',
              textDayFontFamily: 'Inter-Regular',
              textDayHeaderFontFamily: 'Inter-Medium',
            }}
          />
        </Card>

        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Colors.dark.accentBlue} />
            <Text style={styles.sectionTitle}>Évolution de l'humeur</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              Le graphique d'évolution sera disponible prochainement
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.sectionHeader}>
            <Brain size={20} color={Colors.dark.accentBlue} />
            <Text style={styles.sectionTitle}>Aperçus</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>🎯 Série actuelle : 7 jours</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>💊 Excellente adhérence au traitement !</Text>
          </View>
        </Card>
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
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    marginBottom: 20,
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
  card: {
    backgroundColor: Colors.dark.backgroundTertiary,
    marginBottom: 16,
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