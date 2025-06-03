import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface IconButtonProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: object;
}

export default function IconButton({ icon: Icon, size = 24, color = 'currentColor', onPress, style }: IconButtonProps) {
  const Component = Platform.select({
    web: 'button',
    default: TouchableOpacity,
  }) as any;

  return (
    <Component
      onClick={Platform.OS === 'web' ? onPress : undefined}
      onPress={Platform.OS !== 'web' ? onPress : undefined}
      style={[
        Platform.OS === 'web' && {
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        },
        style,
      ]}
    >
      <Icon size={size} color={color} />
    </Component>
  );
}