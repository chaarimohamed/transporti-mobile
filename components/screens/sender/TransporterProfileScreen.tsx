import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import { Carrier, inviteCarrier } from '../../../services/shipment.service';

interface TransporterProfileScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * M2: Transporter Profile Screen
 * Shows detailed profile of a transporter
 */
const TransporterProfileScreen: React.FC<TransporterProfileScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const carrier: Carrier = initialData?.transporter;
  const shipmentId = initialData?.shipmentId;
  const shipmentStatus = initialData?.shipmentStatus;
  const returnScreen: string = initialData?.returnScreen ?? 'suggestedTransporters';

  const handleBack = () => {
    if (returnScreen === 'shipmentDetails' && shipmentId) {
      onNavigate?.('shipmentDetails', { id: shipmentId });
    } else {
      onNavigate?.('suggestedTransporters', { shipmentId, shipment: initialData?.shipment });
    }
  };
  const [isInviting, setIsInviting] = useState(false);

  // Contact info is visible only after both parties agreed (CONFIRMED, IN_TRANSIT, or DELIVERED)
  const showContactInfo = shipmentStatus && ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].includes(shipmentStatus);

  if (!carrier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <AppIcon name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Transporteur</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transporteur introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleInvite = async () => {
    if (!shipmentId) {
      Alert.alert('Erreur', 'ID d\'expédition manquant');
      return;
    }

    setIsInviting(true);
    try {
      const result = await inviteCarrier(shipmentId, carrier.id);
      
      if (result.success) {
        // Navigate to confirmation screen
        onNavigate?.('invitationSent', { transporter: carrier, shipmentId });
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'invitation');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleViewReviews = () => {
    if (!carrier.totalReviews || carrier.totalReviews === 0) {
      Alert.alert(
        'Avis clients',
        'Ce transporteur n\'a pas encore reçu d\'avis.'
      );
    } else {
      Alert.alert(
        'Avis clients',
        `Note moyenne : ${carrier.averageRating?.toFixed(1) ?? 'N/A'} / 5\nNombre d'avis : ${carrier.totalReviews}`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {carrier.firstName} {carrier.lastName}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {carrier.firstName[0]}{carrier.lastName[0]}
              </Text>
            </View>
            {carrier.verified && (
              <View style={styles.verifiedBadge}>
                <AppIcon name="check-circle" size={14} color={Colors.textInverse} />
              </View>
            )}
          </View>

          <Text style={styles.profileName}>
            {carrier.firstName} {carrier.lastName}
          </Text>

          {carrier.verified && (
            <Badge status="success" text="Identité vérifiée" />
          )}

          {/* Rating */}
          <View style={styles.ratingRow}>
            <AppIcon name="star" size={14} color={Colors.primary} />
            <Text style={styles.ratingText}>
              {carrier.averageRating && carrier.averageRating > 0
                ? `${carrier.averageRating.toFixed(1)} / 5  •  ${carrier.totalReviews ?? 0} avis`
                : 'Pas encore évalué'}
            </Text>
          </View>
        </View>

        {/* Contact Info Card - Only shown after matching is confirmed */}
        {showContactInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de contact</Text>
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{carrier.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Téléphone:</Text>
                <Text style={styles.infoValue}>{carrier.phone}</Text>
              </View>
            </Card>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button onPress={handleInvite} disabled={isInviting}>
          {isInviting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color={Colors.textInverse} />
              <Text style={styles.primaryButtonText}>Envoi en cours...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Inviter ce transporteur</Text>
          )}
        </Button>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewReviews}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Voir ses avis</Text>
        </TouchableOpacity>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 20,
    color: Colors.charcoal,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 180,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  avatarText: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: Colors.textInverse,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    borderWidth: 3,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileName: {
    fontFamily: Fonts.semiBold,
    fontSize: 24,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm + 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 4,
  },
  ratingText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: Spacing.sm + 4,
  },
  infoText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginVertical: 4,
  },
  ratingValue: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginRight: 4,
  },
  ratingDivider: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.charcoal,
    marginBottom: Spacing.md,
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  infoLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  bottomSpacer: {
    height: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 20,
    paddingBottom: 34,
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
  },
  secondaryButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default TransporterProfileScreen;
