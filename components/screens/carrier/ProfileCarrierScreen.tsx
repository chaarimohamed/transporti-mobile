import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import BottomNav from '../../ui/BottomNav';

interface ProfileCarrierScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ProfileCarrierScreen: React.FC<ProfileCarrierScreenProps> = ({
  onNavigate,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await logout();
            onNavigate?.('login');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: '👤',
      label: 'Informations personnelles',
      onPress: () => {
        onNavigate?.('personalInformationCarrier');
      },
    },
    {
      icon: '💳',
      label: 'Moyens de paiement',
      onPress: () => {
        Alert.alert('Information', 'Fonctionnalité à venir');
      },
    },
    {
      icon: '🔔',
      label: 'Préférences de notification',
      onPress: () => {
        onNavigate?.('notificationSettingsCarrier');
      },
    },
    {
      icon: '🛡️',
      label: 'Sécurité et Confidentialité',
      onPress: () => {
        onNavigate?.('privacySecurityCarrier');
      },
    },
    {
      icon: '📄',
      label: 'Conditions Générales',
      onPress: () => {
        onNavigate?.('termsAndConditionsCarrier');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || 'T'}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.firstName || 'Transporteur'} {user?.lastName || ''}
          </Text>
          <Text style={styles.role}>Expéditeur • Membre depuis 2026</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav
        active="profile"
        role="carrier"
        onNavigate={onNavigate}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1464F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666666',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuLabel: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  menuArrow: {
    fontSize: 24,
    color: '#CCCCCC',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  footer: {
    height: 24,
  },
});

export default ProfileCarrierScreen;
