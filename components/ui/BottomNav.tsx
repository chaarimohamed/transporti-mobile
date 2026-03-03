import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

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
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'shipments', label: 'Expéditions', icon: '📦' },
    { id: 'notifications', label: 'Notifs', icon: '🔔' },
    { id: 'profile', label: 'Profil', icon: '👤' },
  ];

  const carrierItems = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'missions', label: 'Missions', icon: '🚛' },
    { id: 'active', label: 'En cours', icon: '🕐' },
    { id: 'history', label: 'Historique', icon: '📄' },
    { id: 'profile', label: 'Profil', icon: '👤' },
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
        case 'notifications':
          onNavigate?.('notificationListSender');
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
            style={styles.item}
            onPress={() => handleNavigate(item.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>
              {item.icon}
            </Text>
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 84,
    paddingBottom: 24,
    paddingHorizontal: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    width: 64,
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666666',
  },
  activeLabel: {
    color: '#1464F6',
  },
});

export default BottomNav;
