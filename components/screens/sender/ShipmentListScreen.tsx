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

interface ShipmentListScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const ShipmentListScreen: React.FC<ShipmentListScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('Toutes');
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const tabs = ['Toutes', 'En cours', 'En attente', 'Livrées'];

  useEffect(() => {
    fetchShipments();
  }, [activeTab]);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError('');

      // Map tab to API status filter
      let status: string | undefined;
      if (activeTab === 'En cours') status = 'IN_TRANSIT';
      else if (activeTab === 'En attente') status = 'PENDING';
      else if (activeTab === 'Livrées') status = 'DELIVERED';

      const result = await shipmentService.getMyShipments(status);

      if (result.success && result.shipments) {
        setShipments(result.shipments);
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching shipments:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'REQUESTED':
        return { status: 'warning' as const, text: 'Demande reçue' };
      case 'IN_TRANSIT':
        return { status: 'warning' as const, text: 'En transit' };
      case 'DELIVERED':
        return { status: 'success' as const, text: 'Livré' };
      case 'PENDING':
        return { status: 'neutral' as const, text: 'En attente' };
      case 'CANCELLED':
        return { status: 'neutral' as const, text: 'Annulé' };
      default:
        return { status: 'neutral' as const, text: status };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes expéditions</Text>
        
        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab ? styles.tabActive : styles.tabInactive,
              ]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Shipments List */}
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
            <Text style={styles.emptyText}>Aucune expédition</Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'Toutes'
                ? 'Créez votre première expédition'
                : `Aucune expédition dans "${activeTab}"`}
            </Text>
          </Card>
        ) : (
          shipments.map((shipment) => {
            const badge = getStatusBadge(shipment.status);
            return (
              <Card key={shipment.id} style={styles.shipmentCard}>
                <View style={styles.shipmentHeader}>
                  <Text style={styles.shipmentRef}>{shipment.refNumber}</Text>
                  <Badge status={badge.status} text={badge.text} />
                </View>

                <View style={styles.shipmentBody}>
                  <View style={styles.routeContainer}>
                    <Text style={styles.routeText} numberOfLines={1}>
                      {shipment.from} → {shipment.to}
                    </Text>
                  </View>
                  <View style={styles.shipmentMeta}>
                    <Text style={styles.metaText}>
                      {shipment.cargo || 'Colis'} • {formatDate(shipment.createdAt)}
                    </Text>
                  </View>
                </View>

                <View style={styles.shipmentFooter}>
                  <Text style={styles.priceText}>{shipment.price} TND</Text>
                  <TouchableOpacity
                    onPress={() =>
                      onNavigate && onNavigate('shipmentDetails', { id: shipment.id })
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.detailsLink}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav active="shipments" role="sender" onNavigate={onNavigate} />
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
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: '#1A1A1A',
  },
  tabInactive: {
    backgroundColor: '#F6F6F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  shipmentCard: {
    marginBottom: 12,
    padding: 16,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shipmentRef: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666666',
  },
  shipmentBody: {
    marginBottom: 12,
  },
  routeContainer: {
    marginBottom: 4,
  },
  routeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  shipmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666666',
  },
  shipmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1464F6',
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
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#DC2626',
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

export default ShipmentListScreen;
