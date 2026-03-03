import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';

interface NotificationSettingsCarrierScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const NotificationSettingsCarrierScreen: React.FC<NotificationSettingsCarrierScreenProps> = ({
  onNavigate,
}) => {
  const [newMissions, setNewMissions] = useState(true);
  const [missionUpdates, setMissionUpdates] = useState(true);
  const [payments, setPayments] = useState(true);
  const [messages, setMessages] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('profileCarrier')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Préférences de notification</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Notifications push</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📦</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Nouvelles missions</Text>
                <Text style={styles.settingDescription}>
                  Recevoir des notifications pour les nouvelles opportunités
                </Text>
              </View>
            </View>
            <Switch
              value={newMissions}
              onValueChange={setNewMissions}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔄</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Mises à jour de missions</Text>
                <Text style={styles.settingDescription}>
                  Changements de statut et demandes d'expéditeurs
                </Text>
              </View>
            </View>
            <Switch
              value={missionUpdates}
              onValueChange={setMissionUpdates}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💰</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Paiements</Text>
                <Text style={styles.settingDescription}>
                  Confirmations de paiement et transactions
                </Text>
              </View>
            </View>
            <Switch
              value={payments}
              onValueChange={setPayments}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>💬</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Messages</Text>
                <Text style={styles.settingDescription}>
                  Nouveaux messages des expéditeurs
                </Text>
              </View>
            </View>
            <Switch
              value={messages}
              onValueChange={setMessages}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🎁</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Promotions</Text>
                <Text style={styles.settingDescription}>
                  Offres spéciales et bonus transporteur
                </Text>
              </View>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Email</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>📧</Text>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Résumé hebdomadaire</Text>
                <Text style={styles.settingDescription}>
                  Statistiques et résumé de vos missions
                </Text>
              </View>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: '#E5E5E5', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTexts: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 52,
  },
  footer: {
    height: 20,
  },
});

export default NotificationSettingsCarrierScreen;
