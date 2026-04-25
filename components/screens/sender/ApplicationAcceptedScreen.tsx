import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
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
          <AppIcon name="close" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <AppIcon name="check-circle" size={48} color={Colors.surface} />
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
            <View style={{ marginRight: 12 }}><AppIcon name="map-pin" size={24} color={Colors.primary} /></View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Itinéraire</Text>
              <Text style={styles.infoValue}>
                {shipment?.from} → {shipment?.to}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={{ marginRight: 12 }}><AppIcon name="profile-user" size={24} color={Colors.primary} /></View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Transporteur</Text>
              <Text style={styles.infoValue}>{carrierName}</Text>
            </View>
          </View>

          {shipment?.carrier?.phone && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={{ marginRight: 12 }}><AppIcon name="phone" size={24} color={Colors.primary} /></View>
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
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: Colors.charcoal,
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.charcoal,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.sm,
    paddingHorizontal: 20,
  },
  submessage: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
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
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  actions: {
    width: '100%',
    gap: Spacing.sm + 4,
  },
  primaryButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textInverse,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default ApplicationAcceptedScreen;
