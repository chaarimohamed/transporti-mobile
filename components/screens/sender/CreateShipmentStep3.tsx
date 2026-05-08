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
  Platform,
  Image,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import * as shipmentService from '../../../services/shipment.service';

interface CreateShipmentStep3Props {
  onNavigate?: (screen: string, data?: any) => void;
  initialData?: any;
}

const CreateShipmentStep3: React.FC<CreateShipmentStep3Props> = ({
  onNavigate,
  initialData,
}) => {
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // Restore state from initialData when navigating back
  useEffect(() => {
    if (initialData?.acceptTerms !== undefined) {
      setAcceptTerms(initialData.acceptTerms);
    }
  }, [initialData]);

  const distanceKm = (() => {
    const p = initialData?.pickupCoordinates;
    const d = initialData?.deliveryCoordinates;
    if (p?.lat && p?.lng && d?.lat && d?.lng) {
      const R = 6371;
      const dLat = ((d.lat - p.lat) * Math.PI) / 180;
      const dLng = ((d.lng - p.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((p.lat * Math.PI) / 180) *
          Math.cos((d.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    return null;
  })();

  const getCargoLabel = (format?: string) => {
    switch (format) {
      case 'S':
        return 'Petit colis';
      case 'M':
        return 'Sac / Valise';
      case 'L':
        return 'Meuble / Électroménager';
      case 'XL':
        return 'Déménagement';
      default:
        return 'Marchandise';
    }
  };

  const formatPickupDate = (pickupDate?: string) => {
    if (!pickupDate) {
      return 'Date non spécifiée';
    }

    if (pickupDate.includes('/')) {
      return pickupDate;
    }

    return new Date(pickupDate).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const shipmentData = {
        from: initialData?.pickupAddress || 'Tunis',
        to: initialData?.deliveryAddress || 'Sfax',
        itemName: initialData?.itemName || undefined,
        cargo: getCargoLabel(initialData?.format),
        pickupDate: initialData?.pickupDate || undefined,
        pickupCity: initialData?.pickupCity || undefined,
        deliveryCity: initialData?.deliveryCity || undefined,
        weight: initialData?.weightRange || 'Non spécifié',
        packageFormat: initialData?.format || 'M',
        format: initialData?.format || 'M',
        dimensions: initialData?.dimensions || null,
        specialInstructions: initialData?.specialInstructions || '',
        declaredValue: 0,
        insurance: false,
        // Pickup helper & meeting point
        helperCount: initialData?.helperCount ?? 0,
        pickupMeetingPoint: 'vehicle',
        // Delivery helper & meeting point
        deliveryHelperCount: initialData?.deliveryHelperCount ?? 0,
        deliveryMeetingPoint: 'vehicle',
        // Sender contact info (when not the logged-in user)
        senderName: initialData?.isNotSender ? (initialData?.senderName || null) : null,
        senderPhone: initialData?.isNotSender ? (initialData?.senderPhone || null) : null,
        pickupInstructions: initialData?.pickupInstructions || null,
        // Recipient contact info
        recipientName: initialData?.isNotRecipient ? (initialData?.recipientName || null) : null,
        recipientPhone: initialData?.isNotRecipient ? (initialData?.recipientPhone || null) : null,
        deliveryInstructions: initialData?.deliveryInstructions || null,
      };

      const result = await shipmentService.createShipment(shipmentData);

      if (result.success && result.shipment) {
        // Upload photos separately (avoids bloating the create request)
        const photos: string[] = (initialData?.photos || [])
          .map((p: any) => (typeof p === 'string' ? p : p.base64))
          .filter(Boolean);
        if (photos.length > 0) {
          try {
            await shipmentService.uploadShipmentPhotos(result.shipment.id, photos);
          } catch (e) {
            console.warn('Photo upload failed (non-fatal):', e);
          }
        }
        // Show success message and navigate to dashboard
        if (Platform.OS === 'web') {
          window.alert('✅ Expédition créée avec succès!');
        } else {
          Alert.alert('Succès', 'Expédition créée avec succès!');
        }
        onNavigate?.('dashboard');
      } else {
        if (Platform.OS === 'web') {
          window.alert(`Erreur: ${result.error || 'Impossible de créer l\'expédition'}`);
        } else {
          Alert.alert('Erreur', result.error || 'Impossible de créer l\'expédition');
        }
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      if (Platform.OS === 'web') {
        window.alert('Erreur de connexion');
      } else {
        Alert.alert('Erreur', 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('createShipmentStep2', { ...initialData, acceptTerms })}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Résumé</Text>
          <Text style={styles.stepIndicator}>3/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
      </View>

      {/* Summary Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Route Card */}
        <Card style={styles.routeCard}>
          <View style={styles.routeItem}>
            <View style={styles.routeIconContainer}>
              <AppIcon name="map-pin" size={18} color={Colors.primary} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>COLLECTE</Text>
              <Text style={styles.routeAddress}>
                {initialData?.pickupAddress || 'Adresse non spécifiée'}
              </Text>
              {initialData?.pickupDate && (
                <Text style={styles.routeDate}>
                  {formatPickupDate(initialData.pickupDate)}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeItem}>
            <View style={styles.routeIconContainer}>
              <AppIcon name="location-pin" size={18} color={Colors.accent} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>LIVRAISON</Text>
              <Text style={styles.routeAddress}>
                {initialData?.deliveryAddress || 'Adresse non spécifiée'}
              </Text>
            </View>
          </View>

          {distanceKm !== null && (
            <View style={styles.distanceRow}>
              <AppIcon name="route" size={14} color={Colors.textSecondary} />
              <Text style={styles.distanceText}>Distance estimée : {Math.round(distanceKm)} km</Text>
            </View>
          )}
        </Card>

        {/* Package Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
            {initialData?.itemName && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Article</Text>
                <Text style={styles.detailValue}>{initialData.itemName}</Text>
              </View>
            )}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>
                {initialData?.format === 'S' ? 'Petit' : 
                 initialData?.format === 'M' ? 'Moyen' :
                 initialData?.format === 'L' ? 'Grand' : 'Très grand'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Poids</Text>
              <Text style={styles.detailValue}>{initialData?.weightRange || 'N/A'}</Text>
            </View>
          </View>
        </Card>

        {/* Photos */}
        {initialData?.photos?.length > 0 && (
          <Card style={styles.photosCard}>
            <Text style={styles.photosTitle}>Photos du colis</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {initialData.photos.map((photo: any, index: number) => (
                <Image
                  key={index}
                  source={{ uri: typeof photo === 'string' ? photo : photo.uri }}
                  style={styles.photoThumb}
                />
              ))}
            </ScrollView>
          </Card>
        )}

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          onPress={() => onNavigate?.('createShipmentStep2', { ...initialData, acceptTerms })}
          variant="outline"
          style={styles.backActionButton}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Précédent</Text>
        </Button>
        <Button
          onPress={handleConfirm}
          style={styles.confirmButton}
          disabled={loading}
          loading={loading}
        >
          <Text style={styles.confirmButtonText}>Confirmer</Text>
        </Button>
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
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  stepIndicator: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  routeCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  routeItem: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  routeIconContainer: {
    marginTop: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  routeAddress: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  routeDate: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  detailsCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  detailItem: {
    width: '47%',
  },
  detailLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  detailValueSuccess: {
    color: Colors.success,
  },
  priceCard: {
    padding: 20,
    marginBottom: Spacing.md,
    backgroundColor: Colors.background,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  priceValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.primary,
  },
  priceNote: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  distanceRow: {
    alignItems: 'center',
    borderTopColor: Colors.borderLight,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm + 4,
    paddingTop: Spacing.sm + 4,
  },
  distanceText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
  },
  photosCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  photosScroll: {
    marginTop: Spacing.sm,
  },
  photosTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
  },
  photoThumb: {
    borderRadius: Radius.sm,
    height: 80,
    marginRight: Spacing.sm,
    width: 80,
  },
  termsRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  termsText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    paddingHorizontal: 20,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  backActionButton: {
    flex: 1,
    minHeight: 54,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1.5,
    minHeight: 54,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateShipmentStep3;
