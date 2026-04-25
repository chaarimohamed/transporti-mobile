import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { Colors } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import BottomNav from '../../ui/BottomNav';
import { AppIcon, AppIconName } from '../../ui/Icon';
import * as authService from '../../../services/authService';

interface ProfileCarrierScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ProfileCarrierScreen: React.FC<ProfileCarrierScreenProps> = ({
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    authService.getProfilePhoto().then((res) => {
      if (res.success && res.photoBase64) {
        setPhotoUri(`data:image/jpeg;base64,${res.photoBase64}`);
      }
    });
  }, []);

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

  const menuItems: Array<{
    icon: AppIconName;
    label: string;
    onPress: () => void;
  }> = [
    {
      icon: 'profile-user',
      label: 'Informations personnelles',
      onPress: () => {
        onNavigate?.('personalInformationCarrier');
      },
    },
    {
      icon: 'wallet',
      label: 'Moyens de paiement',
      onPress: () => {
        Alert.alert('Information', 'Fonctionnalité à venir');
      },
    },
    {
      icon: 'notification-bell',
      label: 'Préférences de notification',
      onPress: () => {
        onNavigate?.('notificationSettingsCarrier');
      },
    },
    {
      icon: 'verified-shield',
      label: 'Sécurité et Confidentialité',
      onPress: () => {
        onNavigate?.('privacySecurityCarrier');
      },
    },
    {
      icon: 'document',
      label: 'Conditions Générales',
      onPress: () => {
        onNavigate?.('termsAndConditionsCarrier');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Info */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || 'T'}
            </Text>
          )}
        </View>
        <Text style={styles.name}>
          {user?.firstName || 'Transporteur'} {user?.lastName || ''}
        </Text>
        <Text style={styles.role}>Transporteur • Membre depuis {new Date().getFullYear()}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIconText}>
                <AppIcon name={item.icon} size={20} color={Colors.charcoal} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <AppIcon name="chevron-right" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.logoutIcon}>
              <AppIcon name="logout" size={18} color={Colors.error} />
            </View>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 72,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666666',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 16,
    marginBottom: 8,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconText: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  menuArrow: {
    fontSize: 20,
    color: '#CCCCCC',
    marginLeft: 8,
  },
  logoutSection: {
    paddingTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(217, 45, 32, 0.05)',
    borderRadius: 16,
  },
  logoutIcon: {
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});

export default ProfileCarrierScreen;
