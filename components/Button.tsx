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
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[type],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator 
          color={type === 'primary' ? '#FFFFFF' : Colors.light.tint} 
          size="small" 
        />
      ) : (
        <Text style={[styles.text, styles[`${type}Text`], styles[`${size}Text`]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: Colors.light.tint,
  },
  secondary: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  text: {
    backgroundColor: 'transparent',
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  medium: {
    paddingVertical: 12,
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
    fontWeight: '500',
  },
  secondaryText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  outlineText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  textText: {
    color: Colors.light.tint,
    fontWeight: '500',
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