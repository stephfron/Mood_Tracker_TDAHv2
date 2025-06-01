import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import Card from './Card';
import { Brain, Settings as Lungs, Timer, Zap } from 'lucide-react-native';

interface Strategy {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CopingStrategiesProps {
  onStrategyPress?: (id: string) => void;
}

export default function CopingStrategies({ onStrategyPress }: CopingStrategiesProps) {
  const strategies: Strategy[] = [
    {
      id: 'breathing',
      title: 'Respiration carrée',
      description: 'Inspirez sur 4 temps, retenez sur 4 temps, expirez sur 4 temps, pause de 4 temps. Répétez 5 fois.',
      icon: <Lungs size={24} color={Colors.light.tint} />,
    },
    {
      id: 'pomodoro',
      title: 'Technique Pomodoro',
      description: '25 minutes de travail, 5 minutes de pause. Après 4 cycles, prenez une pause plus longue de 15-30 minutes.',
      icon: <Timer size={24} color={Colors.light.tint} />,
    },
    {
      id: 'bodyscan',
      title: 'Scan corporel',
      description: 'Prenez conscience de chaque partie de votre corps des pieds à la tête. Notez les tensions et relâchez-les.',
      icon: <Brain size={24} color={Colors.light.tint} />,
    },
    {
      id: 'energyboost',
      title: 'Boost d\'énergie',
      description: '20 jumping jacks, 10 squats, 10 secondes de course sur place. Répétez si nécessaire pour réveiller votre corps.',
      icon: <Zap size={24} color={Colors.light.tint} />,
    },
  ];

  return (
    <Card title="Stratégies d'adaptation rapides">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {strategies.map((strategy) => (
          <Pressable
            key={strategy.id}
            style={styles.strategyCard}
            onPress={() => onStrategyPress && onStrategyPress(strategy.id)}
          >
            <View style={styles.iconContainer}>{strategy.icon}</View>
            <Text style={styles.strategyTitle}>{strategy.title}</Text>
            <Text style={styles.strategyDescription} numberOfLines={3}>
              {strategy.description}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.tip}>
        Conseil : Ces stratégies peuvent vous aider à gérer vos symptômes TDAH dans le moment présent.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  strategyCard: {
    width: 200,
    padding: 16,
    backgroundColor: Colors.light.selected,
    borderRadius: 12,
    marginRight: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  strategyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  strategyDescription: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  tip: {
    marginTop: 16,
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
});