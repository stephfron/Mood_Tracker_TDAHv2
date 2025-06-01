import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, useWindowDimensions } from 'react-native';
import { Play, Clock, Moon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const cardWidth = width - 32; // Full width minus padding

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour,</Text>
        <Text style={styles.name}>Sarah</Text>
      </View>

      <View style={styles.featuredCard}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg' }}
          style={styles.featuredImage}
        />
        <View style={styles.featuredContent}>
          <Text style={styles.featuredTitle}>Méditation guidée</Text>
          <Text style={styles.featuredSubtitle}>Commencez votre journée en pleine conscience</Text>
          <Pressable style={styles.playButton}>
            <Play size={24} color="#FFFFFF" />
            <Text style={styles.playButtonText}>Démarrer</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recommandés pour vous</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.recommendedSection}
      >
        {[
          {
            id: '1',
            title: 'Respiration profonde',
            duration: '10 min',
            image: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg'
          },
          {
            id: '2',
            title: 'Méditation du soir',
            duration: '15 min',
            image: 'https://images.pexels.com/photos/924824/pexels-photo-924824.jpeg'
          },
          {
            id: '3',
            title: 'Relaxation guidée',
            duration: '20 min',
            image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg'
          }
        ].map(item => (
          <Pressable key={item.id} style={styles.recommendedCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.recommendedImage}
            />
            <View style={styles.recommendedContent}>
              <Text style={styles.recommendedTitle}>{item.title}</Text>
              <View style={styles.recommendedMeta}>
                <Clock size={16} color={Colors.light.textSecondary} />
                <Text style={styles.recommendedDuration}>{item.duration}</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Exercices du soir</Text>
      <View style={styles.eveningExercises}>
        {[
          {
            id: '1',
            title: 'Relaxation avant le coucher',
            duration: '15 min',
            image: 'https://images.pexels.com/photos/3771836/pexels-photo-3771836.jpeg'
          },
          {
            id: '2',
            title: 'Méditation pour bien dormir',
            duration: '20 min',
            image: 'https://images.pexels.com/photos/1028741/pexels-photo-1028741.jpeg'
          }
        ].map(item => (
          <Pressable 
            key={item.id} 
            style={[styles.eveningCard, { width: cardWidth }]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.eveningImage}
            />
            <View style={styles.eveningContent}>
              <View style={styles.eveningMeta}>
                <Moon size={20} color={Colors.light.tint} />
                <Text style={styles.eveningDuration}>{item.duration}</Text>
              </View>
              <Text style={styles.eveningTitle}>{item.title}</Text>
            </View>
          </Pressable>
        ))}
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
  greeting: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  name: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginTop: 4,
  },
  featuredCard: {
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.light.cardBackground,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredContent: {
    padding: 20,
  },
  featuredTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
    marginBottom: 20,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  recommendedSection: {
    paddingLeft: 16,
  },
  recommendedCard: {
    width: 240,
    borderRadius: 16,
    backgroundColor: Colors.light.cardBackground,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  recommendedImage: {
    width: '100%',
    height: 140,
  },
  recommendedContent: {
    padding: 16,
  },
  recommendedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  recommendedMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendedDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
    marginLeft: 6,
  },
  eveningExercises: {
    padding: 16,
  },
  eveningCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  eveningImage: {
    width: '100%',
    height: 160,
  },
  eveningContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  eveningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eveningDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.light.tint,
    marginLeft: 6,
  },
  eveningTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.light.text,
  },
});