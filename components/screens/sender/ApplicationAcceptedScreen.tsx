import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Button } from '../../ui/Button';
import { Shipment } from '../../../services/shipment.service';

interface ApplicationAcceptedScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * M6: Application Accepted Confirmation Screen
 * Shows success message after accepting a carrier's application
 */
const ApplicationAcceptedScreen: React.FC<ApplicationAcceptedScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const shipment: Shipment | undefined = initialData?.shipment;
  const carrierName = shipment?.carrier 
    ? `${shipment.carrier.firstName} ${shipment.carrier.lastName}`
    : 'le transporteur';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Confirmation</Text>
        <TouchableOpacity
          onPress={() => onNavigate?.('dashboard', { refresh: Date.now() })}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Candidature acceptée !</Text>
        <Text style={styles.message}>
          Vous avez accepté {carrierName} pour votre expédition {shipment?.refNumber || ''}.
        </Text>
        <Text style={styles.submessage}>
          Le transporteur a été notifié et votre expédition est maintenant confirmée.
        </Text>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Itinéraire</Text>
              <Text style={styles.infoValue}>
                {shipment?.from} → {shipment?.to}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>👤</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Transporteur</Text>
              <Text style={styles.infoValue}>{carrierName}</Text>
            </View>
          </View>

          {shipment?.carrier?.phone && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📱</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Téléphone</Text>
                  <Text style={styles.infoValue}>{shipment.carrier.phone}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button onPress={() => onNavigate?.('shipmentDetails', { shipment: shipment })}>
            <Text style={styles.primaryButtonText}>Voir les détails</Text>
          </Button>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => onNavigate?.('dashboard', { refresh: Date.now() })}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Retour au tableau de bord</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444444',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 20,
    color: '#666666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  successIcon: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#444444',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  submessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    fontSize: 24,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: 16,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
});

export default ApplicationAcceptedScreen;
