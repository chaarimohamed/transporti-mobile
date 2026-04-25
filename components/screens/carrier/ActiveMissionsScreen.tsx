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
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import { AppIcon } from '../../ui/Icon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface ActiveMissionsScreenProps {
  onNavigate?: (screen: string, params?: unknown) => void;
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
        return { text: 'Annulée', borderColor: '#EF4444', bgColor: Colors.errorSurface };
      default:
        return { text: status, borderColor: '#999', bgColor: Colors.background };
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
            <View style={styles.clearFilterContent}>
              <AppIcon name="close" size={14} color="#555" />
              <Text style={styles.clearFilterText}>Tout afficher</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Missions List */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <View style={styles.errorRow}>
              <AppIcon name="alert-triangle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchMissions} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : displayedShipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <AppIcon name="truck" size={48} color={Colors.textMuted} />
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
                    <View style={styles.routeRow}>
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {shipment.from}
                      </Text>
                      <AppIcon name="arrow-right" size={14} color={Colors.textMuted} />
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {shipment.to}
                      </Text>
                    </View>
                    <Text style={styles.cargoText}>{shipment.cargo || 'Marchandise'}</Text>
                    {shipment.createdAt && (
                      <View style={styles.dateRow}>
                        <AppIcon name="calendar" size={14} color={Colors.textMuted} />
                        <Text style={styles.dateText}>{formatDate(shipment.createdAt)}</Text>
                      </View>
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
  container: { flex: 1, backgroundColor: Colors.background },
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
    backgroundColor: Colors.background,
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
  clearFilterContent: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  clearFilterText: { fontSize: 13, color: '#555', fontWeight: '600' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  missionCard: { marginBottom: 16, padding: 16, borderLeftWidth: 4 },
  missionHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionRef: { flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap', minWidth: 0 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  priceText: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A' },
  routeContainer: { marginBottom: 12, gap: 4, minWidth: 0 },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  routeText: { fontSize: 15, fontWeight: '600', color: '#1A1A1A', flexShrink: 1 },
  routePoint: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  cargoText: { fontSize: 13, color: '#666666' },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 13, color: '#666666', flexShrink: 1 },
  actionsContainer: { marginTop: 4 },
  updateButton: {},
  updateButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#666' },
  errorCard: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: Colors.errorSurface,
    borderColor: '#FCA5A5',
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  errorText: { fontSize: 14, color: Colors.error, textAlign: 'center' },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.error,
    borderRadius: 6,
  },
  retryText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  emptyCard: { padding: 40, alignItems: 'center' },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  emptySubtext: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 16 },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});

export default ActiveMissionsScreen;
