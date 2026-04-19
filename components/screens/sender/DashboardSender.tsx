import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
  AppState,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import { useAuth } from '../../../contexts/AuthContext';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';
import * as notificationService from '../../../services/notification.service';

interface DashboardSenderProps {
  onNavigate?: (screen: string, params?: unknown) => void;
  initialData?: { refresh?: boolean } | null;
}

const DashboardSender: React.FC<DashboardSenderProps> = ({ onNavigate, initialData }) => {
  const { user, logout } = useAuth();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState({ inProgress: 0, pending: 0, delivered: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh when returning from other screens with refresh flag
  useEffect(() => {
    if (initialData?.refresh) {
      fetchData();
    }
  }, [initialData?.refresh]);

  // BUG-01/02 fix: keep the badge count live so new notifications are reflected
  // without requiring a full app restart or manual pull-to-refresh.
  useEffect(() => {
    const refreshCount = () => {
      notificationService.getUnreadCount().then(result => {
        if (result.success && result.count !== undefined) {
          setUnreadCount(result.count);
        }
      });
    };

    // Refresh whenever the app returns to the foreground
    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') refreshCount();
    });

    // Also poll every 30 s while the screen is mounted
    const interval = setInterval(refreshCount, 30000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [shipmentsResult, statsResult, notifResult] = await Promise.all([
        shipmentService.getMyShipments(),
        shipmentService.getShipmentStats(),
        notificationService.getUnreadCount(),
      ]);

      if (shipmentsResult.success && shipmentsResult.shipments) {
        setShipments(shipmentsResult.shipments.slice(0, 3)); // Show latest 3
      } else {
        setError(shipmentsResult.error || 'Erreur de chargement');
      }

      if (statsResult.success && statsResult.stats) {
        setStats(statsResult.stats);
      }

      if (notifResult.success && notifResult.count !== undefined) {
        setUnreadCount(notifResult.count);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HANDOVER_PENDING':
        return { status: 'warning' as const, text: 'remise en cours' };
      case 'IN_TRANSIT':
        return { status: 'info' as const, text: 'en transit' };
      case 'DELIVERED':
        return { status: 'success' as const, text: 'livrée' };
      case 'PENDING':
        return { status: 'warning' as const, text: 'en attente' };
      case 'REQUESTED':
        return { status: 'warning' as const, text: 'candidature reçue' };
      case 'CONFIRMED':
        return { status: 'success' as const, text: 'confirmée' };
      case 'CANCELLED':
        return { status: 'neutral' as const, text: 'annulée' };
      default:
        return { status: 'neutral' as const, text: status };
    }
  };

  const handleLogout = async () => {
    // For web, use window.confirm, for native use Alert
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Voulez-vous vraiment vous déconnecter ?');
      if (confirmed) {
        await logout();
        onNavigate?.('login');
      }
    } else {
      Alert.alert(
        'Déconnexion',
        'Voulez-vous vraiment vous déconnecter ?',
        [
          {
            text: 'Annuler',
            style: 'cancel',
          },
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — kept outside ScrollView so touch events never conflict with scroll gestures (BUG-02) */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour</Text>
          <Text style={styles.name}>{user?.firstName || 'Ahmed'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => onNavigate?.('notificationListSender')}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* CTA Button */}
        <Button
          onPress={() => onNavigate?.('newShipment')}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaButtonIcon}>➕</Text>
          <Text style={styles.ctaButtonText}>Nouvelle expédition</Text>
        </Button>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onNavigate?.('shipmentList', { activeTab: 'En cours' })}
            style={styles.statTouchable}
          >
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.inProgress}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onNavigate?.('shipmentList', { activeTab: 'En attente' })}
            style={styles.statTouchable}
          >
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>En attente</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => onNavigate?.('shipmentList', { activeTab: 'Livrées' })}
            style={styles.statTouchable}
          >
            <Card style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.delivered}</Text>
              <Text style={styles.statLabel}>Livrées</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Recent Shipments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Expéditions récentes</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigate && onNavigate('shipmentList')}
            >
              <Text style={styles.seeAllLink}>Voir tout →</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1464F6" />
              <Text style={styles.loadingText}>Chargement...</Text>
            </View>
          ) : error ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </Card>
          ) : shipments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>Aucune expédition</Text>
              <Text style={styles.emptySubtext}>
                Créez votre première expédition
              </Text>
            </Card>
          ) : (
            shipments.map((shipment) => {
              const badge = getStatusBadge(shipment.status);
              const isPendingOrRequested = shipment.status === 'PENDING' || shipment.status === 'REQUESTED';
              return (
                <TouchableOpacity
                  key={shipment.id}
                  activeOpacity={0.75}
                  onPress={() => onNavigate?.('shipmentDetails', { id: shipment.id })}
                >
                  <Card style={styles.shipmentCard}>
                    <View style={styles.shipmentHeader}>
                      <Text style={styles.shipmentId}>{shipment.refNumber}</Text>
                      <Badge status={badge.status} text={badge.text} />
                    </View>
                    <View style={styles.shipmentRoute}>
                      <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                        {shipment.from}
                      </Text>
                      <Text style={styles.arrowIcon}>→</Text>
                      <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                        {shipment.to}
                      </Text>
                    </View>
                    <View style={styles.shipmentFooter}>
                      <Text style={styles.priceText}>{shipment.price} TND</Text>
                      {isPendingOrRequested && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={(e) => { e.stopPropagation?.(); onNavigate?.('suggestedTransporters', { shipmentId: shipment.id, shipment }); }}
                        >
                          <Text style={styles.searchTransporterLink}>Chercher un transporteur →</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="home" role="sender" onNavigate={onNavigate} />
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
    padding: 20,
    paddingBottom: 100, // Space for BottomNav
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bellButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FCFCFC',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FEF2F2',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    fontSize: 20,
  },
  ctaButton: {
    marginBottom: 24,
  },
  ctaButtonIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statTouchable: {
    flex: 1,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '500',
  },
  shipmentCard: {
    marginBottom: 12,
  },
  shipmentHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shipmentId: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 12,
    minWidth: 0,
  },
  shipmentRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
  },
  arrowIcon: {
    fontSize: 14,
    color: '#1464F6',
  },
  shipmentFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  searchTransporterLink: {
    fontSize: 13,
    color: '#1464F6',
    fontWeight: '600',
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  errorText: {
    fontSize: 14,
    color: '#D92D20',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D92D20',
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
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default DashboardSender;
