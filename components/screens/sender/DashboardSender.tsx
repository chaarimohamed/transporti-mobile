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
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
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
            <AppIcon name={unreadCount > 0 ? 'bell-active' : 'bell'} size={22} color={Colors.charcoal} />
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
            <AppIcon name="logout" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* CTA Button */}
        <Button
          onPress={() => onNavigate?.('newShipment')}
          style={styles.ctaButton}
          fullWidth
          size="lg"
        >
          Nouvelle expédition
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
              <ActivityIndicator size="large" color={Colors.primary} />
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
              <AppIcon name="package" size={40} color={Colors.primaryLight} />
              <Text style={styles.emptyText}>Aucune expédition</Text>
              <Text style={styles.emptySubtext}>Créez votre première expédition</Text>
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
                      <AppIcon name="map-pin" size={14} color={Colors.primary} />
                      <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">
                        {shipment.from}
                      </Text>
                      <AppIcon name="arrow-right" size={14} color={Colors.textMuted} />
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
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
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
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.navy,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  bellButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontFamily: Fonts.bold,
    color: Colors.textInverse,
    fontSize: FontSizes.xs,
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.errorSurface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(217, 45, 32, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButton: {
    marginBottom: 24,
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
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.navy,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
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
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.navy,
  },
  seeAllLink: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.accent,
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
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.charcoal,
    marginRight: 12,
    minWidth: 0,
  },
  shipmentRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  locationText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  shipmentFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.base,
    color: Colors.navy,
  },
  searchTransporterLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.accent,
    marginTop: 8,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  errorCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.errorSurface,
    borderColor: 'rgba(217,45,32,0.2)',
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.error,
    borderRadius: Radius.sm,
  },
  retryText: {
    fontFamily: Fonts.semiBold,
    color: Colors.textInverse,
    fontSize: FontSizes.sm,
  },
  emptyCard: {
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.charcoal,
  },
  emptySubtext: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});

export default DashboardSender;
