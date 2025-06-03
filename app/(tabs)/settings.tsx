import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Moon, Palette, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';

export default function SettingsScreen() {
  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Réglages</Text>
        </View>

        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bell size={20} color={Colors.dark.accentBlue} />
              <Text style={styles.sectionTitle}>Notifications</Text>
            </View>
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Rappels quotidiens</Text>
              <Switch
                trackColor={{ 
                  false: Colors.dark.backgroundTertiary,
                  true: Colors.dark.accentBlue 
                }}
                thumbColor={Colors.dark.textPrimary}
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Palette size={20} color={Colors.dark.accentBlue} />
              <Text style={styles.sectionTitle}>Apparence</Text>
            </View>
            <View style={styles.setting}>
              <Text style={styles.settingLabel}>Thème sombre</Text>
              <Switch
                trackColor={{ 
                  false: Colors.dark.backgroundTertiary,
                  true: Colors.dark.accentBlue 
                }}
                thumbColor={Colors.dark.textPrimary}
              />
            </View>
          </View>
        </Card>

        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Shield size={20} color={Colors.dark.accentBlue} />
              <Text style={styles.sectionTitle}>Confidentialité</Text>
            </View>
            <Pressable style={styles.menuItem}>
              <Text style={styles.menuItemText}>Gérer les données</Text>
            </Pressable>
            <Pressable style={styles.menuItem}>
              <Text style={styles.menuItemText}>Exporter les données</Text>
            </Pressable>
          </View>
        </Card>

        <Card>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <HelpCircle size={20} color={Colors.dark.accentBlue} />
              <Text style={styles.sectionTitle}>Aide</Text>
            </View>
            <Pressable style={styles.menuItem}>
              <Text style={styles.menuItemText}>Guide d'utilisation</Text>
            </Pressable>
            <Pressable style={styles.menuItem}>
              <Text style={styles.menuItemText}>Contacter le support</Text>
            </Pressable>
          </View>
        </Card>

        <Pressable style={styles.logoutButton}>
          <LogOut size={20} color={Colors.dark.accentRed} />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.dark.textPrimary,
    marginLeft: 8,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textPrimary,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderPrimary,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: Colors.dark.backgroundTertiary,
    borderRadius: 12,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.dark.accentRed,
  },
});