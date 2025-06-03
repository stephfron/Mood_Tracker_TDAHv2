import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Colors from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: object;
  gradient?: boolean;
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  gradient = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[type],
        styles[size],
        gradient && styles.gradient,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' || gradient ? '#FFFFFF' : Colors.light.tint} 
          size="small" 
        />
      ) : (
        <Text style={[
          styles.text,
          styles[`${type}Text`],
          styles[`${size}Text`],
          gradient && styles.gradientText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.light.tint,
  },
  secondary: {
    backgroundColor: Colors.light.selected,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  text: {
    backgroundColor: 'transparent',
  },
  gradient: {
    backgroundColor: Colors.light.tint,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  disabled: {
    opacity: 0.5,
  },
  textBase: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  primaryText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  secondaryText: {
    color: Colors.light.tint,
    fontFamily: 'Inter-SemiBold',
  },
  outlineText: {
    color: Colors.light.tint,
    fontFamily: 'Inter-SemiBold',
  },
  textText: {
    color: Colors.light.tint,
    fontFamily: 'Inter-Medium',
  },
  gradientText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
});