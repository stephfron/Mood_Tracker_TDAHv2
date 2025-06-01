import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Colors from '@/constants/Colors';
import Card from './Card';

interface JournalInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function JournalInput({ value, onChangeText }: JournalInputProps) {
  const [focusedPrompt, setFocusedPrompt] = useState(0);
  
  const prompts = [
    "Qu'est-ce qui a été difficile aujourd'hui ?",
    "Une petite victoire aujourd'hui ?",
    "Comment votre TDAH a-t-il influencé votre journée ?",
    "Qu'est-ce qui vous a aidé à vous sentir mieux ?",
    "Comment votre médication a-t-elle influencé votre journée ?",
  ];
  
  // Cycle through prompts when the input is focused and empty
  const handleFocus = () => {
    if (!value) {
      setFocusedPrompt((prev) => (prev + 1) % prompts.length);
    }
  };

  return (
    <Card title="Journal">
      <Text style={styles.promptText}>{prompts[focusedPrompt]}</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={value}
        onChangeText={onChangeText}
        placeholder="Vos pensées ici..."
        onFocus={handleFocus}
      />
      <Text style={styles.tip}>
        Conseil : Notez vos pensées, émotions ou événements marquants.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  promptText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 8,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  tip: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
});