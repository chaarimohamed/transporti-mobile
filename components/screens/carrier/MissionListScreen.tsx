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
import * as notificationService from '../../../services/notification.service';
import { Shipment } from '../../../services/shipment.service';

interface MissionListScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const MissionListScreen: React.FC<MissionListScreenProps> = ({ onNavigate }) => {
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

      // Build set of shipment IDs where this carrier has a pending invitation
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

  const formatDistance = (from: string, to: string): string => {
    // Simplified distance calculation (in real app, use geolocation)
    return '105 km';
  };

  const formatDuration = (from: string, to: string): string => {
    return '2h 30';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Missions</Text>
        
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
            <ActivityIndicator size="large" color="#1464F6" />
            <Text style={styles.loadingText}>Chargement...</Text>
          </View>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity onPress={fetchShipments} style={styles.retryButton}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : shipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Aucune mission disponible</Text>
            <Text style={styles.emptySubtext}>
              Revenez plus tard pour voir les nouvelles missions
            </Text>
          </Card>
        ) : (
          shipments.map((shipment) => {
            const isInvited = invitedShipmentIds.has(shipment.id);
            return (
            <Card key={shipment.id} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <View style={styles.routeContainer}>
                  <Text style={styles.routeText} numberOfLines={1}>
                    {shipment.from} <Text style={styles.routeArrow}>→</Text> {shipment.to}
                  </Text>
                  <View style={styles.missionMeta}>
                    <Text style={styles.metaText}>
                      📍 {formatDistance(shipment.from, shipment.to)}
                    </Text>
                    <Text style={styles.metaText}>•</Text>
                    <Text style={styles.metaText}>
                      ⏱️ {formatDuration(shipment.from, shipment.to)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.priceText}>{shipment.price} TND</Text>
              </View>

              <View style={styles.badgesContainer}>
                <Badge status="neutral" text={shipment.cargo || 'Marchandise'} />
                {isInvited && <Badge status="warning" text="Invité" />}
                {!isInvited && shipment.createdAt && new Date(shipment.createdAt) >= new Date(Date.now() - 86400000) && (
                  <Badge status="warning" text="Nouveau" />
                )}
              </View>

              <View style={styles.missionActions}>
                <Button
                  onPress={() => onNavigate?.('missionDetails', { id: shipment.id })}
                  style={styles.detailsButton}
                >
                  <Text style={styles.detailsButtonText}>Détails</Text>
                </Button>
                {isInvited ? (
                  <Button
                    onPress={() => onNavigate?.('notificationList')}
                    style={styles.invitedButton}
                  >
                    <Text style={styles.invitedButtonText}>Invitation reçue 📬</Text>
                  </Button>
                ) : (
                  <Button
                    onPress={() => onNavigate?.('missionDetails', { id: shipment.id })}
                    style={styles.acceptButton}
                  >
                    <Text style={styles.acceptButtonText}>Postuler</Text>
                  </Button>
                )}
              </View>
            </Card>
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
    backgroundColor: '#F6F6F6',
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
    backgroundColor: '#F6F6F6',
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
    marginRight: 12,
  },
  routeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  routeArrow: {
    color: '#999',
  },
  missionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  missionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderWidth: 0,
  },
  detailsButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 1,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  invitedButton: {
    flex: 1,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  invitedButtonText: {
    color: '#856404',
    fontSize: 13,
    fontWeight: '600',
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
    textAlign: 'center',
  },
});

export default MissionListScreen;
