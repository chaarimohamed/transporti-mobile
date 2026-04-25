import React, { useState, useEffect, useMemo } from 'react';
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
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import { AppIcon } from '../../ui/Icon';
import { useAuth } from '../../../contexts/AuthContext';
import * as shipmentService from '../../../services/shipment.service';
import * as notificationService from '../../../services/notification.service';
import { Shipment } from '../../../services/shipment.service';

interface MissionListScreenProps {
  onNavigate?: (screen: string, params?: unknown) => void;
}

const MissionListScreen: React.FC<MissionListScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('Toutes');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitedShipmentIds, setInvitedShipmentIds] = useState<Set<string>>(new Set());

  const filters = ['Toutes', 'Proches', 'Date', 'Prix'];

  useEffect(() => {
    fetchShipments();
  }, []);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError('');

      const [shipmentsResult, notifResult] = await Promise.all([
        shipmentService.getAvailableShipments(),
        notificationService.getNotifications(),
      ]);

      if (shipmentsResult.success && shipmentsResult.shipments) {
        setShipments(shipmentsResult.shipments);
      } else {
        setError(shipmentsResult.error || 'Erreur de chargement');
      }

      if (notifResult.success && notifResult.notifications) {
        const ids = new Set<string>(
          notifResult.notifications
            .filter(n => n.type === 'SHIPMENT_INVITATION')
            .map(n => n.shipmentId || n.data?.shipmentId)
            .filter(Boolean) as string[]
        );
        setInvitedShipmentIds(ids);
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // ── Apply filter / sort ────────────────────────────────────────────────────
  const displayedShipments = useMemo(() => {
    let list = [...shipments];
    switch (activeFilter) {
      case 'Proches': {
        const gov = user?.gouvernerat?.toLowerCase();
        if (gov) {
          list = list.filter(s => s.from.toLowerCase().includes(gov));
        }
        // secondary sort: date desc
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      }
      case 'Date':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'Prix':
        list.sort((a, b) => b.price - a.price);
        break;
      default:
        // 'Toutes' — keep backend order (date desc)
        break;
    }
    return list;
  }, [shipments, activeFilter, user?.gouvernerat]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Opportunités</Text>
        
        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filter,
                activeFilter === filter ? styles.filterActive : styles.filterInactive,
              ]}
              onPress={() => setActiveFilter(filter)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter ? styles.filterTextActive : styles.filterTextInactive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Missions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
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
            <TouchableOpacity onPress={fetchShipments} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : displayedShipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <AppIcon name="package-box" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>
              {activeFilter === 'Proches'
                ? 'Aucune mission dans votre région'
                : 'Aucune mission disponible'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeFilter === 'Proches'
                ? 'Essayez le filtre « Toutes » pour voir toutes les missions'
                : 'Revenez plus tard pour voir les nouvelles missions'}
            </Text>
          </Card>
        ) : (
          displayedShipments.map((shipment) => {
            const isInvited = invitedShipmentIds.has(shipment.id);
            const isNew = !isInvited &&
              shipment.createdAt &&
              new Date(shipment.createdAt) >= new Date(Date.now() - 86400000);
            return (
              <TouchableOpacity
                key={shipment.id}
                activeOpacity={0.85}
                onPress={() => onNavigate?.('missionDetails', { id: shipment.id })}
              >
                <Card style={styles.missionCard}>
                  <View style={styles.missionHeader}>
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
                    </View>
                    <Text style={styles.priceText}>{shipment.price} TND</Text>
                  </View>

                  <View style={styles.badgesContainer}>
                    <Badge status="neutral" text={shipment.cargo || 'Marchandise'} />
                    {isInvited && <Badge status="warning" text="Invité" />}
                    {isNew && <Badge status="warning" text="Nouveau" />}
                  </View>

                  <View style={styles.dateRow}>
                    <AppIcon name="calendar" size={14} color={Colors.textMuted} />
                    <Text style={styles.dateText}>
                      {new Date(shipment.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="missions" role="carrier" onNavigate={onNavigate} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: '#1A1A1A',
  },
  filterInactive: {
    backgroundColor: Colors.background,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  filterTextInactive: {
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  missionCard: {
    marginBottom: 16,
    padding: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  routePoint: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    flexShrink: 1,
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
    backgroundColor: Colors.errorSurface,
    borderColor: '#FCA5A5',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: Colors.error,
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

export default MissionListScreen;
