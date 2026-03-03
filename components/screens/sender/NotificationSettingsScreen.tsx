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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Channels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CANAUX</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingLabel}>Push Mobile</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Text style={styles.settingIcon}>✉️</Text>
              <Text style={styles.settingLabel}>Email</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ALERTES</Text>

          <View style={styles.alertItem}>
            <Text style={styles.alertLabel}>Mises à jour de statut</Text>
            <Switch
              value={statusUpdates}
              onValueChange={setStatusUpdates}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.alertItem}>
            <Text style={styles.alertLabel}>Nouvelles offres de mission</Text>
            <Switch
              value={newOffers}
              onValueChange={setNewOffers}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.alertItem}>
            <Text style={styles.alertLabel}>Messages reçus</Text>
            <Switch
              value={messages}
              onValueChange={setMessages}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.alertItem}>
            <Text style={styles.alertLabel}>Promotions et actus</Text>
            <Switch
              value={promotions}
              onValueChange={setPromotions}
              trackColor={{ false: '#E9E9E9', true: '#1464F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
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
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#444444',
    letterSpacing: 1,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    marginBottom: 12,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginBottom: 24,
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  alertLabel: {
    fontSize: 14,
    color: '#1A1A1A',
    flex: 1,
  },
});

export default NotificationSettingsScreen;
