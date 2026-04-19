import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as notificationService from '../../../services/notification.service';
import BottomNav from '../../ui/BottomNav';

interface NotificationListSenderScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  shipmentId?: string;
  data?: any;
}

const NotificationListSenderScreen: React.FC<NotificationListSenderScreenProps> = ({
  onNavigate,
}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getNotifications();
      
      console.log('📨 Fetched notifications result:', result);
      
      if (result.success && result.notifications) {
        console.log('📋 Number of notifications:', result.notifications.length);
        if (result.notifications.length > 0) {
          console.log('📄 First notification sample:', result.notifications[0]);
        }
        setNotifications(result.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    console.log('🔔 Notification pressed:', notification);
    console.log('📦 Notification data:', notification.data);
    
    // Mark as read
    if (!notification.read) {
      await notificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
      );
    }

    // Navigate based on notification type
    const shipmentId = notification.shipmentId || notification.data?.shipmentId;
    if (shipmentId) {
      if (notification.type === 'SHIPMENT_DELIVERED') {
        console.log('🚀 Navigating to shipmentFeedback with ID:', shipmentId);
        onNavigate?.('shipmentFeedback', {
          shipmentId,
          returnScreen: 'shipmentDetails',
          returnParams: { id: shipmentId },
        });
      } else {
        console.log('🚀 Navigating to shipmentDetails with ID:', shipmentId);
        onNavigate?.('shipmentDetails', { id: shipmentId });
      }
    } else {
      console.log('⚠️ No shipmentId found in notification');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CARRIER_REQUEST':
      case 'REQUEST_ACCEPTED':
        return '✅';
      case 'SHIPMENT_INVITATION':
        return '📬';
      case 'REQUEST_REJECTED':
        return '❌';
      case 'SHIPMENT_IN_TRANSIT':
        return '🚚';
      case 'SHIPMENT_DELIVERED':
        return '📦';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'CARRIER_REQUEST':
      case 'REQUEST_ACCEPTED':
      case 'SHIPMENT_DELIVERED':
        return {
          bg: 'rgba(46, 139, 87, 0.1)',
          text: '#2E8B57',
        };
      case 'SHIPMENT_INVITATION':
      case 'SHIPMENT_IN_TRANSIT':
        return {
          bg: 'rgba(20, 100, 246, 0.1)',
          text: '#1464F6',
        };
      case 'REQUEST_REJECTED':
        return {
          bg: 'rgba(217, 45, 32, 0.1)',
          text: '#D92D20',
        };
      default:
        return {
          bg: '#F6F6F6',
          text: '#666666',
        };
    }
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return `Il y a ${diffDays}j`;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1464F6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const colors = getNotificationColor(notification.type);
            const icon = getNotificationIcon(notification.type);

            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.notificationCardUnread,
                ]}
                onPress={() => handleNotificationPress(notification)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.bg },
                  ]}
                >
                  <Text style={styles.iconText}>{icon}</Text>
                </View>

                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !notification.read && styles.notificationTitleUnread,
                      ]}
                    >
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {getTimeAgo(notification.createdAt)}
                    </Text>
                  </View>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="notifications" role="sender" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 16,
    marginBottom: 12,
  },
  notificationCardUnread: {
    backgroundColor: 'rgba(20, 100, 246, 0.02)',
    borderColor: 'rgba(20, 100, 246, 0.2)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
  },
  notificationTitleUnread: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 10,
    color: '#666666',
    flexShrink: 0,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default NotificationListSenderScreen;
