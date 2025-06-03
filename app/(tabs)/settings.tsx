import { View, Text, StyleSheet, ScrollView, Switch, Pressable, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Moon, Palette, Shield, CircleHelp as HelpCircle, LogOut, Download } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import Card from '@/components/Card';
import { exportUserData } from '@/utils/storage';

export default function SettingsScreen() {
  const handleExportData = async () => {
    try {
      const data = await exportUserData();
      await Share.share({
        title: 'Mes données MoodFlow',
        message: data,
      });
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };

  return (
    <LinearGradient
      colors={[Colors.dark.backgroundSecondary, Colors.dark.backgroundPrimary]}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Réglages</Text>

        <Card style={styles.card}>
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

        <Card style={styles.card}>
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

        <Card style={[styles.card, styles.exportCard]}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Download size={20} color={Colors.dark.accentGreen} />
              <Text style={[styles.sectionTitle, { color: Colors.dark.accentGreen }]}>
                Exporter mes données
              </Text>
            </View>
            <Text style={styles.exportDescription}>
              Exportez vos données pour les partager avec votre thérapeute ou les sauvegarder.
              Le fichier exporté contient votre historique d'humeur, de symptômes et de médication.
            </Text>
            <Pressable 
              style={styles.exportButton}
              onPress={handleExportData}
            >
              <Download size={20} color={Colors.dark.textPrimary} />
              <Text style={styles.exportButtonText}>Exporter les données</Text>
            </Pressable>
          </View>
        </Card>

        <Card style={styles.card}>
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
  title: {
    fontSize: 26,
    fontFamily: 'Inter-Bold',
    color: Colors.dark.textPrimary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.dark.backgroundTertiary,
    marginBottom: 16,
  },
  exportCard: {
    borderWidth: 1,
    borderColor: Colors.dark.accentGreen,
    backgroundColor: `${Colors.dark.accentGreen}10`,
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
  exportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.dark.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.accentGreen,
    padding: 16,
    borderRadius: 12,
  },
  exportButtonText: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
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