import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface ActiveMissionsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

// Which stat tile is active as a filter
type FilterKey = 'assigned' | 'applique' | 'completed' | null;

const ASSIGNED_STATUSES = ['CONFIRMED', 'IN_TRANSIT'];
const APPLIQUE_STATUSES = ['REQUESTED'];
const COMPLETED_STATUSES = ['DELIVERED'];

const ActiveMissionsScreen: React.FC<ActiveMissionsScreenProps> = ({ onNavigate }) => {
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>(null);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await shipmentService.getMyShipments();
      if (result.success && result.shipments) {
        setAllShipments(result.shipments);
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats ──────────────────────────────────────────────────────────
  const assignedCount = allShipments.filter(s => ASSIGNED_STATUSES.includes(s.status)).length;
  const appliqueCount = allShipments.filter(s => APPLIQUE_STATUSES.includes(s.status)).length;
  const completedCount = allShipments.filter(s => COMPLETED_STATUSES.includes(s.status)).length;

  // ── Filtered list ──────────────────────────────────────────────────────────
  const displayedShipments = (() => {
    if (activeFilter === 'assigned') return allShipments.filter(s => ASSIGNED_STATUSES.includes(s.status));
    if (activeFilter === 'applique') return allShipments.filter(s => APPLIQUE_STATUSES.includes(s.status));
    if (activeFilter === 'completed') return allShipments.filter(s => COMPLETED_STATUSES.includes(s.status));
    return allShipments;
  })();

  // Toggle: tap active filter → deselect (show all); tap new → select
  const handleFilterTap = (key: FilterKey) => {
    setActiveFilter(prev => (prev === key ? null : key));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return { text: 'Appliqué', borderColor: '#8B5CF6', bgColor: '#F5F3FF' };
      case 'CONFIRMED':
        return { text: 'Confirmée', borderColor: '#3B82F6', bgColor: '#EFF6FF' };
      case 'HANDOVER_PENDING':
        return { text: 'Remise en attente', borderColor: '#F97316', bgColor: '#FFF7ED' };
      case 'IN_TRANSIT':
        return { text: 'En transit', borderColor: '#F59E0B', bgColor: '#FEF3C7' };
      case 'DELIVERED':
        return { text: 'Livrée', borderColor: '#10B981', bgColor: '#ECFDF5' };
      case 'CANCELLED':
        return { text: 'Annulée', borderColor: '#EF4444', bgColor: '#FEF2F2' };
      default:
        return { text: status, borderColor: '#999', bgColor: '#F6F6F6' };
    }
  };

  // ── Stat tile component ────────────────────────────────────────────────────
  const StatTile = ({
    filterKey,
    count,
    label,
    activeColor,
  }: {
    filterKey: FilterKey;
    count: number;
    label: string;
    activeColor: string;
  }) => {
    const isActive = activeFilter === filterKey;
    return (
      <TouchableOpacity
        style={[styles.statCard, isActive && { borderColor: activeColor, borderWidth: 2 }]}
        activeOpacity={0.7}
        onPress={() => handleFilterTap(filterKey)}
      >
        <Text style={[styles.statNumber, isActive && { color: activeColor }]}>{count}</Text>
        <Text style={[styles.statLabel, isActive && { color: activeColor, fontWeight: '700' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Missions</Text>

        <View style={styles.statsContainer}>
          <StatTile filterKey="assigned" count={assignedCount} label="Assignées" activeColor="#3B82F6" />
          <StatTile filterKey="applique" count={appliqueCount} label="Appliqué" activeColor="#8B5CF6" />
          <StatTile filterKey="completed" count={completedCount} label="Livrées" activeColor="#10B981" />
        </View>

        {activeFilter && (
          <TouchableOpacity style={styles.clearFilter} onPress={() => setActiveFilter(null)}>
            <Text style={styles.clearFilterText}>✕  Tout afficher</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Missions List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1464F6" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={fetchMissions} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : displayedShipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🚚</Text>
            <Text style={styles.emptyText}>
              {activeFilter ? 'Aucune mission dans cette catégorie' : 'Aucune mission'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeFilter
                ? 'Appuyez sur la statistique pour désactiver le filtre'
                : 'Consultez la liste des missions disponibles'}
            </Text>
            {!activeFilter && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => onNavigate?.('missionList')}
              >
                <Text style={styles.browseButtonText}>Parcourir les missions</Text>
              </TouchableOpacity>
            )}
          </Card>
        ) : (
          displayedShipments.map((shipment) => {
            const statusConfig = getStatusConfig(shipment.status);
            return (
              <TouchableOpacity
                key={shipment.id}
                activeOpacity={0.85}
                onPress={() => onNavigate?.('missionDetails', { id: shipment.id, returnScreen: 'activeMissions' })}
              >
                <Card
                  style={[styles.missionCard, { borderLeftColor: statusConfig.borderColor }]}
                >
                  <View style={styles.missionHeader}>
                    <View style={styles.missionRef}>
                      <Badge
                        status="neutral"
                        text={shipment.refNumber}
                        style={{ marginRight: 8 }}
                      />
                      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                        <Text style={[styles.statusText, { color: statusConfig.borderColor }]}>
                          {statusConfig.text}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.priceText}>{shipment.price} TND</Text>
                  </View>

                  <View style={styles.routeContainer}>
                    <Text style={styles.routeText} numberOfLines={1}>
                      {shipment.from}{' '}
                      <Text style={styles.routeArrow}>→</Text>{' '}
                      {shipment.to}
                    </Text>
                    <Text style={styles.cargoText}>{shipment.cargo || 'Marchandise'}</Text>
                    {shipment.createdAt && (
                      <Text style={styles.dateText}>📅 {formatDate(shipment.createdAt)}</Text>
                    )}
                  </View>

                  {/* Action button — only for actionable statuses */}
                  {(shipment.status === 'CONFIRMED' || shipment.status === 'IN_TRANSIT') && (
                    <View style={styles.actionsContainer}>
                      <Button
                        onPress={() => onNavigate?.('updateStatus', { id: shipment.id })}
                        style={styles.updateButton}
                      >
                        <Text style={styles.updateButtonText}>
                          {shipment.status === 'CONFIRMED' ? 'Commencer' : 'Mettre à jour'}
                        </Text>
                      </Button>
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <BottomNav active="active" role="carrier" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsContainer: { flexDirection: 'row', gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#666666', fontWeight: '500' },
  clearFilter: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
  },
  clearFilterText: { fontSize: 13, color: '#555', fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  missionCard: { marginBottom: 16, padding: 16, borderLeftWidth: 4 },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionRef: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  routeContainer: { marginBottom: 12, gap: 4 },
  routeText: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  routeArrow: { color: '#999' },
  cargoText: { fontSize: 13, color: '#666666' },
  dateText: { fontSize: 13, color: '#666666' },
  actionsContainer: { marginTop: 4 },
  updateButton: {},
  updateButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  errorCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  errorText: { fontSize: 14, color: '#D92D20', marginBottom: 12, textAlign: 'center' },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D92D20',
    borderRadius: 6,
  },
  retryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  browseButton: {
    backgroundColor: '#1464F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});

export default ActiveMissionsScreen;
