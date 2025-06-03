import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back!</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <Card title="Featured">
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg' }}
          style={styles.featuredImage}
        />
        <Text style={styles.featuredTitle}>Start Your Day Right</Text>
        <Text style={styles.featuredDescription}>
          Discover tips and tricks to make the most of your day.
        </Text>
      </Card>

      <Card title="Quick Actions">
        <View style={styles.quickActions}>
          {['Track', 'Journal', 'Meditate', 'Exercise'].map((action) => (
            <View key={action} style={styles.quickAction}>
              <Text style={styles.quickActionText}>{action}</Text>
            </View>
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -8,
  },
  quickAction: {
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    width: '45%',
    alignItems: 'center',
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
  },
});