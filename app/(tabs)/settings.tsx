import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { Bell, Moon, Palette, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      <Card title="Notifications">
        <View style={styles.setting}>
          <View style={styles.settingHeader}>
            <Bell size={20} color={Colors.light.tint} />
            <Text style={styles.settingTitle}>Push Notifications</Text>
          </View>
          <Switch
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Card title="Appearance">
        <View style={styles.setting}>
          <View style={styles.settingHeader}>
            <Moon size={20} color={Colors.light.tint} />
            <Text style={styles.settingTitle}>Dark Mode</Text>
          </View>
          <Switch
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={[styles.setting, styles.settingLast]}>
          <View style={styles.settingHeader}>
            <Palette size={20} color={Colors.light.tint} />
            <Text style={styles.settingTitle}>Custom Theme</Text>
          </View>
          <Switch
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
            thumbColor="#FFFFFF"
          />
        </View>
      </Card>

      <Card title="About">
        <View style={styles.settingHeader}>
          <Info size={20} color={Colors.light.tint} />
          <Text style={styles.settingTitle}>Version 1.0.0</Text>
        </View>
        <Text style={styles.aboutText}>
          A beautiful and modern React Native app built with Expo.
        </Text>
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
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.light.text,
    marginBottom: 24,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLast: {
    paddingBottom: 0,
    marginBottom: 0,
    borderBottomWidth: 0,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.light.text,
    marginLeft: 12,
  },
  aboutText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.light.textSecondary,
    marginTop: 12,
    lineHeight: 24,
  },
});