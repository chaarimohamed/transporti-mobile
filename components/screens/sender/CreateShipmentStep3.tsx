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
} from 'react-native';
import { Colors } from '../../../theme';
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

  const estimatedPrice = calculatePrice(initialData);

  function calculatePrice(data: any): number {
    let basePrice = 50;
    
    // Weight pricing
    if (data?.weightRange) {
      if (data.weightRange === '<5') basePrice += 20;
      else if (data.weightRange === '5-30') basePrice += 50;
      else if (data.weightRange === '30-50') basePrice += 80;
      else if (data.weightRange === '50-100') basePrice += 120;
      else if (data.weightRange === '>100') basePrice += 200;
    }

    // Format pricing
    if (data?.format) {
      if (data.format === 'S') basePrice += 10;
      else if (data.format === 'M') basePrice += 20;
      else if (data.format === 'L') basePrice += 40;
      else if (data.format === 'XL') basePrice += 80;
    }

    // Helper fees
    if (data?.helperCount === 1) basePrice += 15;
    else if (data?.helperCount === 2) basePrice += 30;
    if (data?.deliveryHelperCount === 1) basePrice += 15;
    else if (data?.deliveryHelperCount === 2) basePrice += 30;

    return basePrice;
  }

  const handleConfirm = async () => {
    try {
      setLoading(true);

      const shipmentData = {
        from: initialData?.pickupAddress || 'Tunis',
        to: initialData?.deliveryAddress || 'Sfax',
        cargo: `Colis ${initialData?.format || 'M'}`,
        price: estimatedPrice,
        pickupDate: initialData?.pickupDate || new Date().toISOString(),
        weight: initialData?.weightRange || 'Non spécifié',
        packageFormat: initialData?.format || 'M',
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
          <Text style={styles.backIcon}>←</Text>
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
              <Text style={styles.routeIcon}>📍</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>COLLECTE</Text>
              <Text style={styles.routeAddress}>
                {initialData?.pickupAddress || 'Adresse non spécifiée'}
              </Text>
              {initialData?.pickupDate && (
                <Text style={styles.routeDate}>
                  {new Date(initialData.pickupDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.routeItem}>
            <View style={styles.routeIconContainer}>
              <Text style={styles.routeIcon}>📍</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeLabel}>LIVRAISON</Text>
              <Text style={styles.routeAddress}>
                {initialData?.deliveryAddress || 'Adresse non spécifiée'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Package Details */}
        <Card style={styles.detailsCard}>
          <View style={styles.detailsGrid}>
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

        {/* Price */}
        <Card style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Prix estimé</Text>
            <Text style={styles.priceValue}>{estimatedPrice} TND</Text>
          </View>
          <Text style={styles.priceNote}>
            Le prix final sera confirmé par le transporteur
          </Text>
        </Card>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
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
    padding: 24,
    paddingBottom: 120,
  },
  routeCard: {
    padding: 16,
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    gap: 12,
  },
  routeIconContainer: {
    marginTop: 4,
  },
  routeIcon: {
    fontSize: 18,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666666',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  routeAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  routeDate: {
    fontSize: 12,
    color: '#666666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: 16,
  },
  detailsCard: {
    padding: 16,
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    width: '47%',
  },
  detailLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailValueSuccess: {
    color: '#2E8B57',
  },
  priceCard: {
    padding: 20,
    marginBottom: 16,
    backgroundColor: Colors.background,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  priceNote: {
    fontSize: 12,
    color: '#666666',
    fontStyle: 'italic',
  },
  termsRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
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
