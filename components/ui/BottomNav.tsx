import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Colors, Fonts, FontSizes, Shadows } from '../../theme';
import { AppIcon } from './Icon';

interface BottomNavProps {
  active?: string;
  role?: 'sender' | 'carrier';
  onNavigate?: (screen: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  active = 'home',
  role = 'sender',
  onNavigate,
}) => {
  const senderItems = [
    { id: 'home', label: 'Accueil', icon: 'home' as const },
    { id: 'shipments', label: 'Expéditions', icon: 'package' as const },
    { id: 'profile', label: 'Profil', icon: 'profile' as const },
  ];

  const carrierItems = [
    { id: 'home', label: 'Accueil', icon: 'home' as const },
    { id: 'missions', label: 'Opportunités', icon: 'truck' as const },
    { id: 'active', label: 'Missions', icon: 'route' as const },
    { id: 'history', label: 'Historique', icon: 'history' as const },
    { id: 'profile', label: 'Profil', icon: 'profile' as const },
  ];

  const items = role === 'sender' ? senderItems : carrierItems;

  const handleNavigate = (itemId: string) => {
    if (role === 'sender') {
      switch (itemId) {
        case 'home':
          onNavigate?.('dashboard');
          break;
        case 'shipments':
          onNavigate?.('shipmentList');
          break;
        case 'profile':
          onNavigate?.('profile');
          break;
        default:
          onNavigate?.(itemId);
      }
    } else if (role === 'carrier') {
      switch (itemId) {
        case 'home':
          onNavigate?.('dashboard');
          break;
        case 'missions':
          onNavigate?.('missionList');
          break;
        case 'active':
          onNavigate?.('activeMissions');
          break;
        case 'history':
          onNavigate?.('paymentHistory');
          break;
        case 'profile':
          onNavigate?.('profileCarrier');
          break;
        default:
          onNavigate?.(itemId);
      }
    }
  };

  return (
    <View style={styles.container}>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <TouchableOpacity
            key={item.id}
            style={[styles.item, isActive && styles.itemActive]}
            onPress={() => handleNavigate(item.id)}
            activeOpacity={0.7}
          >
            {isActive && <View style={styles.activeIndicator} />}
            <AppIcon
              name={item.icon}
              size={22}
              color={isActive ? Colors.primary : Colors.textMuted}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 84,
    paddingBottom: 24,
    paddingHorizontal: 4,
    ...Shadows.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingTop: 8,
    position: 'relative',
  },
  itemActive: {
    // intentionally empty — indicator handles the visual
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.primary,
  },
});

export default BottomNav;
