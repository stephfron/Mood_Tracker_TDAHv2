import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface CardProps {
  title?: string;
  children: ReactNode;
  style?: object;
  gradient?: boolean;
}

export default function Card({ title, children, style, gradient }: CardProps) {
  return (
    <View style={[styles.card, gradient && styles.gradientCard, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 24,
    padding: 24,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
  },
  gradientCard: {
    backgroundColor: Colors.light.tint,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
});