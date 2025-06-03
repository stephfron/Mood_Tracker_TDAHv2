import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';

export default function CalendarScreen() {
  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Calendrier</Text>

        <Card>
          <Calendar
            theme={{
              backgroundColor: Colors.dark.backgroundPrimary,
              calendarBackground: Colors.dark.backgroundTertiary,
              textSectionTitleColor: Colors.dark.textPrimary,
              selectedDayBackgroundColor: Colors.dark.accentBlue,
              selectedDayTextColor: Colors.dark.textPrimary,
              todayTextColor: Colors.dark.accentBlue,
              dayTextColor: Colors.dark.textPrimary,
              textDisabledColor: Colors.dark.textSecondary,
              dotColor: Colors.dark.accentBlue,
              selectedDotColor: Colors.dark.textPrimary,
              arrowColor: Colors.dark.accentBlue,
              monthTextColor: Colors.dark.textPrimary,
              textMonthFontFamily: 'Inter-SemiBold',
              textDayFontFamily: 'Inter-Regular',
              textDayHeaderFontFamily: 'Inter-Medium',
            }}
          />
        </Card>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    marginBottom: 20,
  },
});