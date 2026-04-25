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
import { Colors } from '../../../theme';
import { AppIcon } from '../../ui/Icon';

interface NotificationSettingsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const NotificationSettingsScreen: React.FC<NotificationSettingsScreenProps> = ({
  onNavigate,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState(true);
  const [newOffers, setNewOffers] = useState(true);
  const [messages, setMessages] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('profile')}
        >
          <AppIcon name="arrow-back" size={18} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
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
              <View style={styles.settingIcon}>
                <AppIcon name="notification-bell" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Push Mobile</Text>
                <Text style={styles.settingDescription}>
                  Recevoir les notifications sur votre appareil
                </Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AppIcon name="email" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Email</Text>
                <Text style={styles.settingDescription}>
                  Recevoir les notifications par email
                </Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Alertes</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AppIcon name="refresh" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Mises à jour de statut</Text>
                <Text style={styles.settingDescription}>
                  Changements de statut de vos expéditions
                </Text>
              </View>
            </View>
            <Switch
              value={statusUpdates}
              onValueChange={setStatusUpdates}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AppIcon name="package-box" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Nouvelles offres de mission</Text>
                <Text style={styles.settingDescription}>
                  Propositions de transporteurs pour vos envois
                </Text>
              </View>
            </View>
            <Switch
              value={newOffers}
              onValueChange={setNewOffers}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AppIcon name="chat" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Messages reçus</Text>
                <Text style={styles.settingDescription}>
                  Nouveaux messages des transporteurs
                </Text>
              </View>
            </View>
            <Switch
              value={messages}
              onValueChange={setMessages}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <AppIcon name="star-rating" size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Promotions et actus</Text>
                <Text style={styles.settingDescription}>
                  Offres spéciales et actualités
                </Text>
              </View>
            </View>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: '#E5E5E5', true: Colors.primary }}
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
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
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
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

export default NotificationSettingsScreen;
