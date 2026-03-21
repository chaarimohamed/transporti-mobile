import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
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

const ActiveMissionsScreen: React.FC<ActiveMissionsScreenProps> = ({
  onNavigate,
}) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ assigned: 0, inProgress: 0, completed: 0 });

  useEffect(() => {
    fetchActiveMissions();
    fetchStats();
  }, []);

  const fetchActiveMissions = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch shipments where carrier is assigned
      const result = await shipmentService.getMyShipments();

      if (result.success && result.shipments) {
        // Filter to only show confirmed and in transit
        const activeShipments = result.shipments.filter(
          (s) => s.status === 'CONFIRMED' || s.status === 'IN_TRANSIT'
        );
        setShipments(activeShipments);
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

  const fetchStats = async () => {
    try {
      const result = await shipmentService.getCarrierShipmentStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return {
          text: 'Confirmée',
          borderColor: '#3B82F6',
          bgColor: '#EFF6FF',
        };
      case 'IN_TRANSIT':
        return {
          text: 'En cours',
          borderColor: '#F59E0B',
          bgColor: '#FEF3C7',
        };
      default:
        return {
          text: status,
          borderColor: '#999',
          bgColor: '#F6F6F6',
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Missions</Text>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.assigned}</Text>
            <Text style={styles.statLabel}>Assignées</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Complétées</Text>
          </View>
        </View>
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
            <TouchableOpacity
              onPress={fetchActiveMissions}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </Card>
        ) : shipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🚚</Text>
            <Text style={styles.emptyText}>Aucune mission active</Text>
            <Text style={styles.emptySubtext}>
              Consultez la liste des missions disponibles
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => onNavigate?.('missionList')}
            >
              <Text style={styles.browseButtonText}>Parcourir les missions</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          shipments.map((shipment) => {
            const statusConfig = getStatusConfig(shipment.status);
            return (
              <Card
                key={shipment.id}
                style={[
                  styles.missionCard,
                  { borderLeftColor: statusConfig.borderColor },
                ]}
              >
                <View style={styles.missionHeader}>
                  <View style={styles.missionRef}>
                    <Badge
                      status="neutral"
                      text={shipment.refNumber}
                      style={{ marginRight: 8 }}
                    />
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusConfig.bgColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: statusConfig.borderColor },
                        ]}
                      >
                        {statusConfig.text}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.priceText}>{shipment.price} TND</Text>
                </View>

                <View style={styles.routeContainer}>
                  <Text style={styles.routeText} numberOfLines={1}>
                    {shipment.from} <Text style={styles.routeArrow}>→</Text> {shipment.to}
                  </Text>
                  <Text style={styles.cargoText}>{shipment.cargo || 'Marchandise'}</Text>
                  {shipment.createdAt && (
                    <Text style={styles.dateText}>
                      📅 {formatDate(shipment.createdAt)}
                    </Text>
                  )}
                </View>

                <View style={styles.actionsContainer}>
                  <Button
                    onPress={() =>
                      onNavigate?.('missionDetails', { id: shipment.id })
                    }
                    style={styles.detailsButton}
                  >
                    <Text style={styles.detailsButtonText}>Voir le détail</Text>
                  </Button>
                  {(shipment.status === 'CONFIRMED' || shipment.status === 'IN_TRANSIT') && (
                    <Button
                      onPress={() =>
                        onNavigate?.('updateStatus', { id: shipment.id })
                      }
                      style={styles.updateButton}
                    >
                      <Text style={styles.updateButtonText}>
                        {shipment.status === 'CONFIRMED' ? 'Commencer' : 'Mettre à jour'}
                      </Text>
                    </Button>
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="active" role="carrier" onNavigate={onNavigate} />
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
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
    borderLeftWidth: 4,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionRef: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  routeContainer: {
    marginBottom: 16,
    gap: 4,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  routeArrow: {
    color: '#999',
  },
  cargoText: {
    fontSize: 13,
    color: '#666666',
  },
  dateText: {
    fontSize: 13,
    color: '#666666',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
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
  updateButton: {
    flex: 1,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
    marginBottom: 16,
  },
  browseButton: {
    backgroundColor: '#1464F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ActiveMissionsScreen;
