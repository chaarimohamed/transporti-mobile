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
  Alert,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import * as notificationService from '../../../services/notification.service';
import * as shipmentService from '../../../services/shipment.service';

interface NotificationListScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

/**
 * NotificationListScreen - Shows carrier notifications with actions
 * Displays invitations and allows carrier to accept/decline
 */
const NotificationListScreen: React.FC<NotificationListScreenProps> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await notificationService.getNotifications();

      if (result.success && result.notifications) {
        setNotifications(result.notifications);
        // Mark as read
        await notificationService.markAllAsRead();
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleAcceptInvitation = async (notification: any) => {
    if (!notification.shipmentId) {
      Alert.alert('Erreur', 'ID d\'expédition manquant');
      return;
    }

    setProcessingId(notification.id);
    try {
      // Request the shipment (carrier applies)
      const result = await shipmentService.requestShipment(notification.shipmentId);
      
      if (result.success) {
        Alert.alert(
          'Succès',
          'Votre candidature a été envoyée à l\'expéditeur',
          [
            {
              text: 'OK',
              onPress: () => {
                // Refresh notifications
                fetchNotifications();
              },
            },
          ]
        );
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'acceptation');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineInvitation = (notification: any) => {
    Alert.alert(
      'Refuser l\'invitation',
      'Êtes-vous sûr de vouloir refuser cette invitation ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: async () => {
            // Just remove from view - no API call needed
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
          },
        },
      ]
    );
  };

  const handleViewShipment = (notification: any) => {
    if (notification.shipmentId) {
      onNavigate?.('missionDetails', { shipmentId: notification.shipmentId });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SHIPMENT_INVITATION':
        return '📬';
      case 'REQUEST_ACCEPTED':
        return '✅';
      case 'REQUEST_REJECTED':
        return '❌';
      case 'SHIPMENT_IN_TRANSIT':
        return '🚛';
      case 'SHIPMENT_DELIVERED':
        return '📦';
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
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
        <TouchableOpacity
          onPress={() => onNavigate?.('dashboard')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={fetchNotifications} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : notifications.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyTitle}>Aucune notification</Text>
            <Text style={styles.emptyText}>
              Vous recevrez ici les invitations et mises à jour sur vos expéditions
            </Text>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationIcon}>
                  {getNotificationIcon(notification.type)}
                </Text>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>
                    {formatDate(notification.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Action buttons for invitations */}
              {notification.type === 'SHIPMENT_INVITATION' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.viewDetailsButton]}
                    onPress={() => onNavigate?.('missionDetails', { 
                      shipmentId: notification.shipmentId,
                      fromInvitation: true 
                    })}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewDetailsButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* View details button for other notification types */}
              {notification.type !== 'SHIPMENT_INVITATION' && notification.shipmentId && (
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => handleViewShipment(notification)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.viewButtonText}>Voir les détails →</Text>
                </TouchableOpacity>
              )}
            </Card>
          ))
        )}
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444444',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#DC2626',
    borderRadius: 6,
  },
  retryText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationCard: {
    padding: 16,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  notificationIcon: {
    fontSize: 32,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999999',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    backgroundColor: '#F6F6F6',
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  acceptButton: {
    backgroundColor: '#1464F6',
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewDetailsButton: {
    backgroundColor: '#1464F6',
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1464F6',
  },
});

export default NotificationListScreen;
