import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, useWindowDimensions } from 'react-native';
import { Sun, Moon, Sparkles, TrendingUp } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import MoodSelector from '@/components/MoodSelector';
import SymptomSelector from '@/components/SymptomSelector';
import Card from '@/components/Card';
import CopingStrategies from '@/components/CopingStrategies';
import { MoodEntry, DEFAULT_MOOD_ENTRY } from '@/types/mood';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const [moodEntry, setMoodEntry] = useState<MoodEntry>({
    ...DEFAULT_MOOD_ENTRY,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  });

  const timeOfDay = new Date().getHours() < 12 ? 'matin' : new Date().getHours() < 18 ? 'après-midi' : 'soir';
  const greetingIcon = timeOfDay === 'matin' ? Sun : timeOfDay === 'après-midi' ? Sparkles : Moon;
  const GreetingIcon = greetingIcon;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.greetingContainer}>
          <GreetingIcon size={32} color={Colors.light.tint} style={styles.greetingIcon} />
          <View>
            <Text style={styles.greeting}>Bon {timeOfDay},</Text>
            <Text style={styles.name}>Sarah</Text>
          </View>
        </View>
        
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <TrendingUp size={20} color={Colors.light.tint} />
            <View style={styles.statContent}>
              <Text style={styles.statValue}>7 jours</Text>
              <Text style={styles.statLabel}>Suivi continu</Text>
            </View>
          </View>
        </View>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Comment vous sentez-vous ?</Text>
        <MoodSelector
          selectedMood={moodEntry.mood}
          onSelectMood={(mood) => setMoodEntry({ ...moodEntry, mood })}
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Symptômes TDAH</Text>
        <View style={styles.symptomsContainer}>
          <SymptomSelector
            title="Concentration"
            selectedLevel={moodEntry.symptoms.concentration}
            onSelectLevel={(level) =>
              setMoodEntry({
                ...moodEntry,
                symptoms: { ...moodEntry.symptoms, concentration: level },
              })
            }
          />
          <SymptomSelector
            title="Agitation"
            selectedLevel={moodEntry.symptoms.agitation}
            onSelectLevel={(level) =>
              setMoodEntry({
                ...moodEntry,
                symptoms: { ...moodEntry.symptoms, agitation: level },
              })
            }
          />
        </View>
      </Card>

      <CopingStrategies />

      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Ressources recommandées</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.resourcesScroll}>
          {[
            {
              id: '1',
              title: 'Méditation guidée TDAH',
              description: 'Une séance de 10 minutes pour améliorer la concentration',
              image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'
            },
            {
              id: '2',
              title: 'Routine du soir',
              description: 'Établir une routine apaisante pour mieux dormir',
              image: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg'
            }
          ].map(resource => (
            <Pressable key={resource.id} style={styles.resourceCard}>
              <Image
                source={{ uri: resource.image }}
                style={styles.resourceImage}
              />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 16,
    paddingTop: 24,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingIcon: {
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
  },
  statsCard: {
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  symptomsContainer: {
    gap: 16,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 16,
  },
  resourcesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  resourceCard: {
    width: 280,
    borderRadius: 16,
    backgroundColor: Colors.light.cardBackground,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceImage: {
    width: '100%',
    height: 160,
  },
  resourceContent: {
    padding: 16,
  },
  resourceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  resourceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
  },
});