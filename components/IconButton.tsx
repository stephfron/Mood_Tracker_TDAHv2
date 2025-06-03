import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';

interface IconButtonProps {
  icon: typeof LucideIcon;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: object;
}

export default function IconButton({ 
  icon: Icon, 
  size = 24, 
  color = 'currentColor', 
  onPress, 
  style 
}: IconButtonProps) {
  if (Platform.OS === 'web') {
    return (
      <button
        onClick={onPress}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
      >
        <Icon size={size} color={color} />
      </button>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Icon size={size} color={color} />
    </TouchableOpacity>
  );
}