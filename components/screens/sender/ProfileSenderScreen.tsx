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

interface ProfileSenderScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ProfileSenderScreen: React.FC<ProfileSenderScreenProps> = ({
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
        onNavigate?.('personalInformation');
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
        onNavigate?.('notificationSettings');
      },
    },
    {
      icon: 'verified-shield',
      label: 'Sécurité et Confidentialité',
      onPress: () => {
        onNavigate?.('privacySecurity');
      },
    },
    {
      icon: 'document',
      label: 'Conditions Générales',
      onPress: () => {
        onNavigate?.('termsAndConditions');
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
            <AppIcon name="profile-user" size={40} color={Colors.textMuted} />
          )}
        </View>
        <Text style={styles.userName}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.userRole}>
          Expéditeur • Membre depuis {new Date().getFullYear()}
        </Text>
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
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIcon}>
                <AppIcon name={item.icon} size={20} color={Colors.charcoal} />
              </View>
              <Text style={styles.menuItemLabel}>{item.label}</Text>
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

      <BottomNav active="profile" role="sender" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.background,
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
  avatarIcon: {
    fontSize: 48,
    opacity: 0.5,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
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
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  chevronIcon: {
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

export default ProfileSenderScreen;
