import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import BottomNav from '../../ui/BottomNav';
import { AppIcon } from '../../ui/Icon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface ShipmentListScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: { activeTab?: string };
}

const ShipmentListScreen: React.FC<ShipmentListScreenProps> = ({ onNavigate, initialData }) => {
  const [activeTab, setActiveTab] = useState(initialData?.activeTab ?? 'Toutes');
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
        return { status: 'warning' as const, text: 'candidature reçue' };
      case 'IN_TRANSIT':
        return { status: 'warning' as const, text: 'en transit' };
      case 'DELIVERED':
        return { status: 'success' as const, text: 'livrée' };
      case 'PENDING':
        return { status: 'neutral' as const, text: 'en attente' };
      case 'CONFIRMED':
        return { status: 'success' as const, text: 'confirmée' };
      case 'CANCELLED':
        return { status: 'neutral' as const, text: 'annulée' };
      default:
        return { status: 'neutral' as const, text: status };
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString.includes('/')) {
      return dateString;
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const getPhotoUri = (photo: string) => {
    if (photo.startsWith('data:') || photo.startsWith('http')) {
      return photo;
    }

    return `data:image/jpeg;base64,${photo}`;
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
        ) : shipments.length === 0 ? (
          <Card style={styles.emptyCard}>
            <AppIcon name="package-box" size={48} color={Colors.textMuted} />
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
            const routeFrom = shipment.pickupCity || shipment.from;
            const routeTo = shipment.deliveryCity || shipment.to;
            const summaryDate = shipment.pickupDate || shipment.createdAt;
            return (
              <Card key={shipment.id} style={styles.shipmentCard}>
                <View style={styles.shipmentHeader}>
                  <Text style={styles.shipmentRef}>{shipment.refNumber}</Text>
                  <Badge status={badge.status} text={badge.text} />
                </View>

                <View style={styles.shipmentBody}>
                  <Text style={styles.itemNameText} numberOfLines={1}>
                    {shipment.itemName || shipment.cargo || 'Article'}
                  </Text>
                  <View style={styles.routeContainer}>
                    <View style={styles.routeRow}>
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {routeFrom}
                      </Text>
                      <AppIcon name="arrow-right" size={14} color={Colors.textMuted} />
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {routeTo}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.badgesRow}>
                    <Badge status="neutral" text={shipment.cargo || 'Marchandise'} />
                  </View>
                  {(shipment.photoPreviews?.length ?? 0) > 0 && (
                    <View style={styles.photoStrip}>
                      {shipment.photoPreviews?.map((photo, index) => (
                        <Image
                          key={`${shipment.id}-preview-${index}`}
                          source={{ uri: getPhotoUri(photo) }}
                          style={styles.photoPreview}
                        />
                      ))}
                    </View>
                  )}
                  <View style={styles.dateRow}>
                    <AppIcon name="calendar" size={12} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{formatDate(summaryDate)}</Text>
                  </View>
                </View>

                <View style={styles.shipmentFooter}>
                  <Text style={styles.summaryHint}>Résumé de la demande</Text>
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
    backgroundColor: Colors.background,
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
    fontSize: 18,
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
    backgroundColor: Colors.background,
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
  itemNameText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  routeContainer: {
    marginBottom: 4,
    overflow: 'hidden',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  routePoint: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
    marginTop: 6,
  },
  photoStrip: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
    marginTop: 4,
  },
  photoPreview: {
    borderRadius: 8,
    height: 44,
    width: 44,
  },
  dateRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
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
  summaryHint: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
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

export default ShipmentListScreen;
