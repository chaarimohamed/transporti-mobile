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
  RefreshControl,
  AppState,
} from 'react-native';
import { Card } from '../../ui/Card';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';
import * as notificationService from '../../../services/notification.service';

interface DashboardCarrierProps {
  onNavigate?: (screen: string, params?: unknown) => void;
}

const DashboardCarrier: React.FC<DashboardCarrierProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ assigned: 0, applied: 0, inProgress: 0, completed: 0 });
  const [availableShipments, setAvailableShipments] = useState<Shipment[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Keep the notification badge live (same fix as sender dashboard)
  useEffect(() => {
    const refreshCount = () => {
      notificationService.getUnreadCount().then(result => {
        if (result.success && result.count !== undefined) {
          setUnreadCount(result.count);
        }
      });
    };

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') refreshCount();
    });

    const interval = setInterval(refreshCount, 30000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 Fetching carrier dashboard data...');

      // Fetch stats, available shipments, completed shipments, and notifications in parallel
      const [statsResult, shipmentsResult, completedShipmentsResult, notifResult] = await Promise.all([
        shipmentService.getCarrierShipmentStats(),
        shipmentService.getAvailableShipments('PENDING', user?.gouvernerat || undefined), // Filter by carrier's gouvernerat
        shipmentService.getMyShipments(), // Get carrier's shipments for earnings calculation
        notificationService.getUnreadCount(),
      ]);

      console.log('📊 Carrier stats result:', statsResult);

      if (statsResult.success && statsResult.stats) {
        console.log('✅ Setting stats:', statsResult.stats);
        setStats(statsResult.stats);
      } else {
        console.log('❌ Stats fetch failed:', statsResult.error);
        // Set default stats on error
        setStats({ assigned: 0, applied: 0, inProgress: 0, completed: 0 });
      }

      if (shipmentsResult.success && shipmentsResult.shipments) {
        const gouvernerat = user?.gouvernerat;
        const filtered = gouvernerat
          ? shipmentsResult.shipments.filter(s =>
              s.from.toLowerCase().includes(gouvernerat.toLowerCase())
            )
          : shipmentsResult.shipments;
        // Show only first 3 shipments on dashboard
        setAvailableShipments(filtered.slice(0, 3));
      }

      // Calculate earnings from completed shipments
      if (completedShipmentsResult.success && completedShipmentsResult.shipments) {
        const completedShipments = completedShipmentsResult.shipments.filter(s => s.status === 'DELIVERED');
        const earnings = completedShipments.reduce((sum, shipment) => sum + shipment.price, 0);
        setTotalEarnings(earnings);
      } else {
        setTotalEarnings(0);
      }

      if (notifResult.success && notifResult.count !== undefined) {
        setUnreadCount(notifResult.count);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
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

  // assigned and inProgress are the same value from backend (both = IN_TRANSIT count)
  // So we should only use one, not add them together
  const activeDeliveries = stats.assigned; // or stats.inProgress - they're identical

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — outside ScrollView so the bell button is always reliably tappable */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour</Text>
          <Text style={styles.name}>{user?.firstName || 'Sami'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.bellButton}
            activeOpacity={0.7}
            onPress={() => onNavigate?.('notificationList')}
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* KPI Hero Card */}
        <TouchableOpacity
          style={styles.kpiCard}
          activeOpacity={0.8}
          onPress={() => onNavigate?.('activeMissions')}
        >
          <View style={styles.kpiContent}>
            <View>
              <Text style={styles.kpiLabel}>Assignés</Text>
              <Text style={styles.kpiNumber}>{activeDeliveries}</Text>
            </View>
            <AppIcon name="truck" size={48} color="rgba(235,185,95,0.35)" />
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <AppIcon name="wallet" size={28} color={Colors.primary} />
            <Text style={styles.statNumber}>{totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TND</Text>
            <Text style={styles.statSubLabel}>Ce mois</Text>
          </Card>
          <Card style={styles.statCard}>
            <AppIcon name="check-circle" size={28} color={Colors.success} />
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Livraisons</Text>
            <Text style={styles.statSubLabel}>Total</Text>
          </Card>
        </View>

        {/* Available Missions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Missions disponibles</Text>
            <TouchableOpacity 
              style={styles.filterButton} 
              activeOpacity={0.7}
              onPress={() => onNavigate?.('missionList')}
            >
              <AppIcon name="search" size={14} color={Colors.textSecondary} />
              <Text style={styles.filterText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Card style={styles.errorCard}>
              <AppIcon name="alert-triangle" size={20} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={fetchDashboardData} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </Card>
          ) : availableShipments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <AppIcon name="truck" size={40} color={Colors.primaryLight} />
              <Text style={styles.emptyText}>Aucune mission disponible</Text>
              <Text style={styles.emptySubtext}>Revenez plus tard pour voir les nouvelles missions</Text>
            </Card>
          ) : (
            availableShipments.map((shipment) => (
              <TouchableOpacity
                key={shipment.id}
                activeOpacity={0.8}
                onPress={() => onNavigate?.('missionDetails', { id: shipment.id })}
              >
                <Card style={styles.missionCard}>
                  <View style={styles.missionHeader}>
                    <Badge status="neutral" text={shipment.refNumber} />
                    <View style={styles.dateTag}>
                      <AppIcon name="calendar" size={12} color={Colors.textInverse} />
                      <Text style={styles.dateText}>
                        {new Date(shipment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.missionRoute}>
                    <AppIcon name="map-pin" size={14} color={Colors.primary} />
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{shipment.from}</Text>
                    <AppIcon name="arrow-right" size={14} color={Colors.textMuted} />
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{shipment.to}</Text>
                  </View>
                  <Text style={styles.cargoText}>
                    {shipment.cargo || shipment.description || 'Marchandise'}
                  </Text>
                  <View style={styles.missionFooter}>
                    <Text style={styles.priceText}>{shipment.price} TND</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="home" role="carrier" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: { flex: 1 },
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
    borderWidth: 2,
    borderColor: Colors.background,
  },
  notificationBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
    color: Colors.textInverse,
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
  kpiCard: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.lg,
    padding: 24,
    marginBottom: 20,
    ...Shadows.lg,
  },
  kpiContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.primaryLight,
    marginBottom: 8,
  },
  kpiNumber: {
    fontFamily: Fonts.bold,
    fontSize: 40,
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  statNumber: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.navy,
  },
  statLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
  },
  statSubLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  section: { marginBottom: 16 },
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
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  missionCard: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  missionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: Colors.navy,
    borderRadius: Radius.sm,
  },
  dateText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    color: Colors.textInverse,
  },
  missionRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    minWidth: 0,
  },
  locationText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    flex: 1,
    minWidth: 0,
  },
  cargoText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.base,
    color: Colors.navy,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
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
    textAlign: 'center',
  },
});

export default DashboardCarrier;
