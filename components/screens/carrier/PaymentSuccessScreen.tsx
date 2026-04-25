import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import { AppIcon } from '../../ui/Icon';
import * as missionService from '../../../services/mission.service';

interface PaymentSuccessScreenProps {
  route?: { params?: { missionId?: string; shipmentId?: string; amount?: number; clientName?: string; receiptNumber?: string; mission?: any } };
  onNavigate?: (screen: string, params?: any) => void;
}

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({
  route,
  onNavigate,
}) => {
  const missionId = route?.params?.missionId || '#12345';
  const shipmentId = route?.params?.shipmentId;
  const amount = route?.params?.mission?.price || route?.params?.amount || 45;
  const mission = route?.params?.mission;
  const clientName = mission?.sender
    ? `${mission.sender.firstName} ${mission.sender.lastName}`
    : route?.params?.clientName || 'Client';
  const receiptNumber = route?.params?.receiptNumber || 'RCP123';
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const scaleAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
    // Mission status already updated to DELIVERED by confirmDelivery API
  }, []);

  const handleOpenFeedback = () => {
    if (shipmentId && onNavigate) {
      onNavigate('shipmentFeedback', {
        shipmentId,
        returnScreen: 'activeMissions',
      });
    }
  };

  const handleViewReceipt = () => {
    if (onNavigate) {
      onNavigate('paymentReceipt', {
        receiptNumber,
        amount,
        clientName,
        date: currentDate,
        missionId,
        shipmentId,
        mission: route?.params?.mission, // Pass mission data
      });
    }
  };

  const handleBackToMissions = () => {
    if (onNavigate) {
      onNavigate('activeMissions');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToMissions}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerSpacer} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Icon */}
        <Animated.View
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successCircle}>
            <AppIcon name="check-circle" size={44} color={Colors.textInverse} />
          </View>
        </Animated.View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Paiement confirmé !</Text>
        <Text style={styles.successSubtitle}>
          La livraison a été complétée avec succès.
        </Text>

        {/* Receipt Summary Card */}
        <Card style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={styles.receiptIconCircle}>
              <AppIcon name="receipt" size={24} color={Colors.primary} />
            </View>
            <View style={styles.receiptInfo}>
              <Text style={styles.receiptNumber}>Reçu {receiptNumber}</Text>
              <Badge text="PAYÉ" variant="success" />
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.receiptDetails}>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Montant encaissé</Text>
              <Text style={styles.receiptAmount}>{amount} DT</Text>
            </View>

            <View style={styles.dashedDivider}>
              <View style={styles.dashedLine} />
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Client</Text>
              <Text style={styles.receiptValue}>{clientName}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Date</Text>
              <Text style={styles.receiptValue}>{currentDate}</Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <Button
          onPress={handleOpenFeedback}
          size="lg"
          fullWidth
        >
          Évaluer l'expéditeur
        </Button>
        <Button
          onPress={handleViewReceipt}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Voir le récapitulatif
        </Button>

        {/* Notification Badge */}
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationIcon}>✓</Text>
          <Text style={styles.notificationText}>
            Le client a été notifié de la livraison
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
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
  headerSpacer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  successIconContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#D4E8DD',
    borderColor: 'rgba(46, 139, 87, 0.2)',
    borderWidth: 1,
    marginBottom: 32,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(46, 139, 87, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  receiptIcon: {
    fontSize: 20,
  },
  receiptInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
    marginVertical: 16,
  },
  receiptDetails: {
    marginTop: 0,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666666',
  },
  receiptAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  dashedDivider: {
    height: 1,
    marginVertical: 4,
  },
  dashedLine: {
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(46, 139, 87, 0.2)',
  },
  notificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  notificationIcon: {
    fontSize: 16,
    color: '#2E8B57',
    marginRight: 8,
  },
  notificationText: {
    fontSize: 12,
    color: '#2E8B57',
  },
});

export default PaymentSuccessScreen;
