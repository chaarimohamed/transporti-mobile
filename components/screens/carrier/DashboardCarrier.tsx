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
          <ActivityIndicator size="large" color="#1464F6" />
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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Dark KPI Card */}
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
            <Text style={styles.truckIcon}>🚛</Text>
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statNumber}>{totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>TND</Text>
            <Text style={styles.statSubLabel}>Ce mois</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
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
              <Text style={styles.filterIcon}>🔍</Text>
              <Text style={styles.filterText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
              <TouchableOpacity onPress={fetchDashboardData} style={styles.retryButton}>
                <Text style={styles.retryText}>Réessayer</Text>
              </TouchableOpacity>
            </Card>
          ) : availableShipments.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>Aucune mission disponible</Text>
              <Text style={styles.emptySubtext}>
                Revenez plus tard pour voir les nouvelles missions
              </Text>
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
                      <Text style={styles.calendarIcon}>📅</Text>
                      <Text style={styles.dateText}>
                        {new Date(shipment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.missionRoute}>
                    <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{shipment.from}</Text>
                    <Text style={styles.arrowIcon}>→</Text>
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
    borderWidth: 2,
    borderColor: '#F6F6F6',
  },
  notificationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
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
  kpiCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  kpiContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 8,
  },
  kpiNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  truckIcon: {
    fontSize: 48,
    opacity: 0.5,
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
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  statSubLabel: {
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
    flex: 1,
    marginRight: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FCFCFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  filterIcon: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
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
    flexShrink: 0,
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#1464F6',
    borderRadius: 12,
  },
  calendarIcon: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  missionRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    minWidth: 0,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    minWidth: 0,
  },
  arrowIcon: {
    fontSize: 14,
    color: '#1464F6',
  },
  cargoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
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
    textAlign: 'center',
  },
});

export default DashboardCarrier;
