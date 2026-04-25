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
import Badge from '../../ui/Badge';
import { AppIcon } from '../../ui/Icon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface PaymentHistoryScreenProps {
  onNavigate?: (screen: string, params?: unknown) => void;
}

interface HistoryItem {
  id: string;
  status: 'paid' | 'pending' | 'problem';
  amount: number;
  date: string;
  orderId: string;
  clientName: string;
  paymentMethod: string;
}

const PaymentHistoryScreen: React.FC<PaymentHistoryScreenProps> = ({
  onNavigate,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('Payées');
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState<Shipment[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, totalDeliveries: 0 });

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Fetch only DELIVERED missions for billing history
      const result = await shipmentService.getMyShipments('DELIVERED');
      
      if (result.success && result.shipments) {
        setMissions(result.shipments);
        
        // Calculate stats from delivered missions only
        const totalEarnings = result.shipments.reduce((sum, m) => sum + m.price, 0);
        
        setStats({
          totalEarnings,
          totalDeliveries: result.shipments.length,
        });
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredMissions = () => {
    // All missions are already DELIVERED — apply time/status filters
    const now = new Date();
    if (selectedFilter === 'Cette semaine') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return missions.filter(m => new Date(m.updatedAt) >= weekAgo);
    } else if (selectedFilter === 'Ce mois') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return missions.filter(m => new Date(m.updatedAt) >= monthStart);
    }
    // 'Payées' — return all (all are DELIVERED)
    return missions;
  };

  const mapMissionToHistoryItem = (mission: Shipment): HistoryItem => {
    const status: 'paid' | 'pending' | 'problem' = 
      mission.status === 'DELIVERED' ? 'paid' :
      mission.status === 'CANCELLED' ? 'problem' : 'pending';

    const date = new Date(mission.updatedAt);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    return {
      id: mission.id,
      status,
      amount: mission.price,
      date: formattedDate,
      orderId: mission.refNumber.replace('EXP-', ''),
      clientName: 'Client',
      paymentMethod: 'Espèces',
    };
  };

  const historyItems = getFilteredMissions().map(mapMissionToHistoryItem);

  const filters = ['Cette semaine', 'Ce mois', 'Payées'];

  const handleViewReceipt = (item: HistoryItem) => {
    if (onNavigate) {
      onNavigate('paymentReceipt', {
        receiptNumber: `RCP${item.orderId}`,
        amount: item.amount,
        clientName: item.clientName,
        date: item.date,
        missionId: `#${item.orderId}`,
      });
    }
  };

  const handleFilterPress = () => {
    // Show filter options
  };

  const renderHistoryCard = (item: HistoryItem) => {
    const statusConfig = {
      paid: { label: 'livrée', variant: 'success' as const },
      pending: { label: 'en transit', variant: 'warning' as const },
      problem: { label: 'annulée', variant: 'error' as const },
    };

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => handleViewReceipt(item)}
        activeOpacity={0.7}
      >
        <Card style={styles.historyCard}>
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <Badge 
              text={statusConfig[item.status].label} 
              variant={statusConfig[item.status].variant}
            />
            <Text style={styles.cardDate}>{item.date}</Text>
          </View>

          {/* Card Body */}
          <View style={styles.cardBody}>
            <View style={styles.cardInfoSection}>
              <Text style={styles.orderIdText}>Commande #{item.orderId}</Text>
              <Text style={styles.clientNameText}>{item.clientName}</Text>
            </View>
            <Text style={styles.amountText}>{item.amount} DT</Text>
          </View>

          {/* Card Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.paymentMethodContainer}>
              <AppIcon name="wallet" size={16} color={Colors.textMuted} />
              <Text style={styles.paymentMethodText}>{item.paymentMethod}</Text>
            </View>
            <View style={styles.viewReceiptContainer}>
              <Text style={styles.viewReceiptText}>Voir reçu</Text>
              <AppIcon name="chevron-right" size={16} color={Colors.textMuted} />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('activeMissions')}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Facturation</Text>
        <View style={styles.filterButton} />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsLabel}>Total encaissé</Text>
          <Text style={styles.statsAmount}>{stats.totalEarnings.toFixed(0)} DT</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalDeliveries}</Text>
              <Text style={styles.statLabel}>Livraisons</Text>
            </View>
          </View>
        </Card>

        {/* Month Label */}
        <Text style={styles.monthLabel}>
          {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
        </Text>

        {/* History List */}
        {historyItems.length > 0 ? (
          historyItems.map(renderHistoryCard)
        ) : (
          <View style={styles.emptyContainer}>
            <AppIcon name="package-box" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Aucun paiement trouvé</Text>
          </View>
        )}

        {/* End of History */}
        <View style={styles.endOfHistoryContainer}>
          <AppIcon name="calendar" size={16} color={Colors.textMuted} />
          <Text style={styles.endOfHistoryText}>Fin de l'historique</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  filterIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingRight: 24,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.background,
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#1A1A1A',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsCard: {
    backgroundColor: Colors.primary,
    marginBottom: 24,
    padding: 24,
  },
  statsLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  statsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    marginBottom: 16,
  },
  historyCard: {
    marginBottom: 16,
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  cardDate: {
    flexShrink: 1,
    fontSize: 12,
    color: '#666666',
    marginLeft: 8,
    textAlign: 'right',
  },
  cardBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  cardInfoSection: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  orderIdText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  clientNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  amountText: {
    flexShrink: 0,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  cardIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666666',
    flexShrink: 1,
  },
  viewReceiptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 8,
  },
  viewReceiptText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginRight: 2,
  },
  chevronIcon: {
    fontSize: 16,
    color: Colors.primary,
  },
  endOfHistoryContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    opacity: 0.5,
  },
  calendarIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  endOfHistoryText: {
    fontSize: 12,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
  },
});

export default PaymentHistoryScreen;
