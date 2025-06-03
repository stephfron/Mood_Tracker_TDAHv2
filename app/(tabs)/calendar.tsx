import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Card>
        <Text style={styles.text}>Calendar content will go here</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.text,
  },
});