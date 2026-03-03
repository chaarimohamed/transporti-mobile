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
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';
import * as notificationService from '../../../services/notification.service';

interface ApplicationListScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

/**
 * ApplicationListScreen - Shows shipments with carrier requests (GROUPE 2)
 * Displays only shipments with status REQUESTED so sender can manage applications
 */
const ApplicationListScreen: React.FC<ApplicationListScreenProps> = ({ onNavigate }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchApplications();
    markNotificationsAsRead();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');

      const [shipmentsResult, notifResult] = await Promise.all([
        shipmentService.getMyShipments(),
        notificationService.getNotifications(true), // Get unread only
      ]);

      if (shipmentsResult.success && shipmentsResult.shipments) {
        // Filter only REQUESTED shipments (those with carrier applications)
        const requestedShipments = shipmentsResult.shipments.filter(
          s => s.status === 'REQUESTED' && s.requestedCarrierId
        );
        setShipments(requestedShipments);
      } else {
        setError(shipmentsResult.error || 'Erreur de chargement');
      }

      if (notifResult.success && notifResult.notifications) {
        setNotifications(notifResult.notifications);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      // Mark all carrier request notifications as read
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchApplications();
    setRefreshing(false);
  };

  const handleViewApplication = (shipment: Shipment) => {
    onNavigate?.('applicationDetails', { shipment });
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
        <Text style={styles.headerTitle}>Candidatures</Text>
        <View style={styles.headerRight}>
          {shipments.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{shipments.length}</Text>
            </View>
          )}
        </View>
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
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button onPress={fetchApplications} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Réessayer</Text>
            </Button>
          </Card>
        ) : shipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Aucune candidature</Text>
            <Text style={styles.emptyText}>
              Les demandes de transporteurs apparaîtront ici
            </Text>
          </Card>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              Demandes de transporteurs
            </Text>
            {shipments.map((shipment) => (
              <Card key={shipment.id} style={styles.applicationCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.refNumber}>{shipment.refNumber}</Text>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>En attente</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDate}>
                    {new Date(shipment.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.routeInfo}>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={styles.locationText}>{shipment.from}</Text>
                    </View>
                    <View style={styles.routeArrow}>
                      <Text style={styles.arrowIcon}>→</Text>
                    </View>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>🎯</Text>
                      <Text style={styles.locationText}>{shipment.to}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Prix:</Text>
                    <Text style={styles.infoValue}>{shipment.price} TND</Text>
                  </View>

                  <View style={styles.notification}>
                    <Text style={styles.notificationIcon}>👤</Text>
                    <Text style={styles.notificationText}>
                      Un transporteur souhaite prendre cette expédition
                    </Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.viewButton}
                    onPress={() => handleViewApplication(shipment)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewButtonText}>Voir les détails</Text>
                    <Text style={styles.viewButtonArrow}>→</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="notifs" role="sender" onNavigate={onNavigate} />
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
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
    alignItems: 'flex-end',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorCard: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: '#1464F6',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyCard: {
    padding: 48,
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  applicationCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  pendingBadge: {
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
  },
  cardDate: {
    fontSize: 13,
    color: '#999999',
  },
  cardBody: {
    padding: 16,
    gap: 12,
  },
  routeInfo: {
    gap: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationIcon: {
    fontSize: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  routeArrow: {
    paddingLeft: 24,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#999999',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1464F6',
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationText: {
    flex: 1,
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  cardFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#1464F6',
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  viewButtonArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ApplicationListScreen;
