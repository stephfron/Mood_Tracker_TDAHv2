import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserStats } from '@/types/mood';
import Colors from '@/constants/Colors';
import Card from './Card';
import { TrendingUp, CircleCheck as CheckCircle, CircleCheck as CheckCircle2 } from 'lucide-react-native';

interface StatsCardProps {
  stats: UserStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  return (
    <Card style={styles.statsCard}>
      <View style={styles.statItem}>
        <View style={styles.iconContainer}>
          <CheckCircle size={20} color={Colors.light.tint} />
        </View>
        <View>
          <Text style={styles.statValue}>{stats.currentStreak} jour{stats.currentStreak > 1 ? 's' : ''}</Text>
          <Text style={styles.statLabel}>Série actuelle</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.iconContainer}>
          <TrendingUp size={20} color={Colors.light.tint} />
        </View>
        <View>
          <Text style={styles.statValue}>{stats.longestStreak} jour{stats.longestStreak > 1 ? 's' : ''}</Text>
          <Text style={styles.statLabel}>Série la plus longue</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.iconContainer}>
          <CheckCircle2 size={20} color={Colors.light.tint} />
        </View>
        <View>
          <Text style={styles.statValue}>{stats.totalEntries}</Text>
          <Text style={styles.statLabel}>Entrées totales</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    marginVertical: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.selected,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 8,
  },
});