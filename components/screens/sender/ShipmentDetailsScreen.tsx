import React, { useState, useEffect } from 'react';
import {
  AppState,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment, confirmHandover } from '../../../services/shipment.service';

interface ShipmentDetailsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

const ShipmentDetailsScreen: React.FC<ShipmentDetailsScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [shipment, setShipment] = useState<Shipment | null>(
    initialData?.shipment || null
  );
  const [loading, setLoading] = useState(!initialData?.shipment);
  const [error, setError] = useState('');
  const shipmentId = initialData?.id || initialData?.shipment?.id || shipment?.id;

  useEffect(() => {
    if (shipmentId) {
      fetchShipment(shipmentId, !shipment);
    }
  }, [shipmentId]);

  useEffect(() => {
    if (!shipmentId) {
      return;
    }

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        fetchShipment(shipmentId, false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [shipmentId]);

  useEffect(() => {
    if (
      !shipmentId ||
      (shipment?.status !== 'CONFIRMED' && shipment?.status !== 'HANDOVER_PENDING')
    ) {
      return;
    }

    const interval = setInterval(() => {
      fetchShipment(shipmentId, false);
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, [shipment?.status, shipmentId]);

  const fetchShipment = async (id: string, showLoader = true) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const result = await shipmentService.getShipmentById(id);

      if (result.success && result.shipment) {
        setShipment(result.shipment);
      } else {
        const message = result.error || 'Erreur de chargement';

        if (showLoader || !shipment) {
          setError(message);
        }
      }
    } catch (err) {
      console.error('Error fetching shipment:', err);

      if (showLoader || !shipment) {
        setError('Erreur de connexion');
      }
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HANDOVER_PENDING':
        return { status: 'warning' as const, text: 'remise en cours' };
      case 'IN_TRANSIT':
        return { status: 'warning' as const, text: 'en transit' };
      case 'DELIVERED':
        return { status: 'success' as const, text: 'livrée' };
      case 'PENDING':
        return { status: 'neutral' as const, text: 'en attente' };
      case 'REQUESTED':
        return { status: 'warning' as const, text: 'candidature reçue' };
      case 'CONFIRMED':
        return { status: 'success' as const, text: 'confirmée' };
      case 'CANCELLED':
        return { status: 'neutral' as const, text: 'annulée' };
      default:
        return { status: 'neutral' as const, text: status };
    }
  };

  // Maps every status to which timeline step (0=Créée, 1=En transit, 2=Livrée) is current
  const STATUS_LEVEL: Record<string, number> = {
    CANCELLED: 0, PENDING: 0, REQUESTED: 0, CONFIRMED: 0, HANDOVER_PENDING: 0,
    IN_TRANSIT: 1, DELIVERED: 2,
  };

  const getStepStatus = (stepIndex: number, currentStatus: string): 'completed' | 'active' | 'inactive' => {
    const level = STATUS_LEVEL[currentStatus] ?? 0;
    if (stepIndex < level) return 'completed';
    if (stepIndex === level) return level === 2 ? 'completed' : 'active';
    return 'inactive';
  };

  const formatDateTime = (iso: string): string => {
    const d = new Date(iso);
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const month = months[d.getMonth()];
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hh}:${mm}`;
  };

  const formatPickupDate = (pickupDate?: string): string | null => {
    if (!pickupDate) {
      return null;
    }

    if (pickupDate.includes('/')) {
      return pickupDate;
    }

    return new Date(pickupDate).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPackageFormatLabel = (packageFormat?: string): string | null => {
    switch (packageFormat) {
      case 'S':
        return 'Petit colis';
      case 'M':
        return 'Sac / Valise';
      case 'L':
        return 'Meuble / Électroménager';
      case 'XL':
        return 'Déménagement';
      default:
        return packageFormat || null;
    }
  };

  const handleCancelShipment = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Êtes-vous sûr de vouloir annuler cette expédition ?')) {
        cancelShipment();
      }
    } else {
      Alert.alert(
        'Annuler l\'expédition',
        'Êtes-vous sûr de vouloir annuler cette expédition ?',
        [
          { text: 'Non', style: 'cancel' },
          { text: 'Oui', onPress: cancelShipment, style: 'destructive' },
        ]
      );
    }
  };

  const cancelShipment = async () => {
    if (!shipment) return;

    try {
      setLoading(true);
      const result = await shipmentService.cancelShipment(shipment.id);

      if (result.success) {
        onNavigate?.('dashboard');
      } else {
        const msg = result.error || 'Impossible d\'annuler';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Erreur', msg);
        }
      }
    } catch (err) {
      console.error('Error canceling shipment:', err);
      if (Platform.OS === 'web') {
        window.alert('Erreur de connexion');
      } else {
        Alert.alert('Erreur', 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmHandover = async () => {
    if (!shipment) return;

    const confirmMsg = 'Confirmez-vous avoir remis le colis au transporteur ?';

    const onConfirm = async () => {
      try {
        setLoading(true);
        const result = await confirmHandover(shipment.id);

        if (result.success && result.shipment) {
          setShipment(result.shipment);
          const successMsg = 'Remise confirmée ! Le transporteur est maintenant en route.';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert('Succès', successMsg);
          }
        } else {
          const errorMsg = result.error || 'Impossible de confirmer la remise';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Erreur', errorMsg);
          }
        }
      } catch (err) {
        console.error('Error confirming handover:', err);
        if (Platform.OS === 'web') {
          window.alert('Erreur de connexion');
        } else {
          Alert.alert('Erreur', 'Erreur de connexion');
        }
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Confirmer la remise', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Confirmer', onPress: onConfirm },
      ]);
    }
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

  if (error || !shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AppIcon name="alert-triangle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error || 'Expédition introuvable'}</Text>
          <Button onPress={() => onNavigate?.('dashboard')}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const badge = getStatusBadge(shipment.status);
  const shipmentTitle = shipment.itemName || shipment.cargo || 'Colis';
  const pickupDateLabel = formatPickupDate(shipment.pickupDate);
  const packageFormatLabel = getPackageFormatLabel(shipment.packageFormat);
  const shipmentPhotos = shipment.packagePhotos?.length
    ? shipment.packagePhotos
    : shipment.photoPreviews || [];
  const totalPhotos = shipment.photosCount ?? shipment.packagePhotos?.length ?? shipment.photoPreviews?.length ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('dashboard')}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails {shipment.refNumber}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Carrier Request (if REQUESTED status) */}
        {shipment.status === 'REQUESTED' && shipment.requestedCarrierId && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Candidature reçue</Text>
            </View>
            <Card style={styles.requestCard}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => shipment.requestedCarrier && onNavigate?.('transporterProfile', {
                  transporter: shipment.requestedCarrier,
                  shipmentId: shipment.id,
                  shipment,
                  shipmentStatus: shipment.status,
                  returnScreen: 'shipmentDetails',
                })}
              >
                <View style={styles.carrierProfileRow}>
                  <View style={styles.carrierAvatar}>
                    <Text style={styles.carrierAvatarText}>
                      {shipment.requestedCarrier
                        ? `${shipment.requestedCarrier.firstName[0]}${shipment.requestedCarrier.lastName[0]}`
                        : '?'}
                    </Text>
                  </View>
                  <View style={styles.carrierInfo}>
                    <Text style={styles.carrierName}>
                      {shipment.requestedCarrier
                        ? `${shipment.requestedCarrier.firstName} ${shipment.requestedCarrier.lastName}`
                        : 'Transporteur'}
                    </Text>
                    <View style={styles.carrierMeta}>
                      <View style={styles.carrierMetaItem}>
                        <AppIcon name="star" size={12} color={Colors.primary} />
                        <Text style={styles.carrierRating}>
                          {shipment.requestedCarrier?.averageRating && shipment.requestedCarrier.averageRating > 0
                            ? shipment.requestedCarrier.averageRating.toFixed(1)
                            : 'N/A'}
                        </Text>
                      </View>
                      {shipment.requestedCarrier?.gouvernerat && (
                        <View style={styles.carrierMetaItem}>
                          <Text style={styles.carrierLocation}> • </Text>
                          <AppIcon name="map-pin" size={12} color={Colors.textSecondary} />
                          <Text style={styles.carrierLocation}>{shipment.requestedCarrier.gouvernerat}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={styles.profileArrow}>›</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.infoDivider} />
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => onNavigate?.('applicationDetails', { shipment })}
                activeOpacity={0.7}
              >
                <Text style={styles.acceptButtonText}>Voir les candidatures</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Carrier Info (if assigned) */}
        {shipment.carrier && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transporteur</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onNavigate?.('transporterProfile', {
                transporter: shipment.carrier,
                shipmentId: shipment.id,
                shipment,
                shipmentStatus: shipment.status,
                returnScreen: 'shipmentDetails',
              })}
            >
              <Card style={styles.carrierCard}>
                <View style={styles.carrierAvatar}>
                  <Text style={styles.carrierAvatarText}>
                    {shipment.carrier.firstName[0]}{shipment.carrier.lastName[0]}
                  </Text>
                </View>
                <View style={styles.carrierInfo}>
                  <Text style={styles.carrierName}>
                    {shipment.carrier.firstName} {shipment.carrier.lastName}
                  </Text>
                  <View style={styles.carrierMeta}>
                    <View style={styles.carrierMetaItem}>
                      <AppIcon name="star" size={12} color={Colors.primary} />
                      <Text style={styles.carrierRating}>
                        {shipment.carrier.averageRating && shipment.carrier.averageRating > 0
                          ? shipment.carrier.averageRating.toFixed(1)
                          : 'N/A'}
                      </Text>
                    </View>
                    {shipment.carrier.gouvernerat && (
                      <View style={styles.carrierMetaItem}>
                        <Text style={styles.carrierLocation}> • </Text>
                        <AppIcon name="map-pin" size={12} color={Colors.textSecondary} />
                        <Text style={styles.carrierLocation}>{shipment.carrier.gouvernerat}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text style={styles.profileArrow}>›</Text>
              </Card>
            </TouchableOpacity>
          </>
        )}

        {/* Information Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations</Text>
        </View>
        <Card style={styles.infoCard}>
          {/* Itinerary visual: green dot → line → blue dot */}
          <View style={styles.itinerary}>
            <View style={styles.itineraryRow}>
              <View style={styles.itineraryDotCol}>
                <View style={styles.dotGreen} />
                <View style={styles.itineraryConnector} />
              </View>
              <View style={styles.itineraryTextContent}>
                <Text style={styles.infoLabel}>Départ</Text>
                <Text style={styles.infoValue}>{shipment.from}</Text>
              </View>
            </View>
            <View style={styles.itineraryRow}>
              <View style={styles.itineraryDotCol}>
                <View style={styles.dotBlue} />
              </View>
              <View style={styles.itineraryTextContent}>
                <Text style={styles.infoLabel}>Arrivée</Text>
                <Text style={styles.infoValue}>{shipment.to}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <AppIcon name="package" size={16} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Article</Text>
              <Text style={styles.infoValue}>{shipmentTitle}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          {pickupDateLabel && (
            <>
              <View style={styles.infoRow}>
                <AppIcon name="calendar" size={16} color={Colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Date de collecte</Text>
                  <Text style={styles.infoValue}>{pickupDateLabel}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
            </>
          )}

          {packageFormatLabel && (
            <>
              <View style={styles.infoRow}>
                <AppIcon name="package-box" size={16} color={Colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Format</Text>
                  <Text style={styles.infoValue}>{packageFormatLabel}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
            </>
          )}

          {(shipment.pickupCity || shipment.deliveryCity) && (
            <>
              <View style={styles.infoRow}>
                <AppIcon name="route" size={16} color={Colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Trajet</Text>
                  <Text style={styles.infoValue}>
                    {shipment.pickupCity || shipment.from} - {shipment.deliveryCity || shipment.to}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
            </>
          )}

          {shipment.description && (
            <>
              <View style={styles.infoRowTop}>
                <AppIcon name="document" size={16} color={Colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Description</Text>
                  <Text style={styles.infoValue}>{shipment.description}</Text>
                </View>
              </View>

              <View style={styles.infoDivider} />
            </>
          )}

          <View style={styles.infoRow}>
            <AppIcon name="wallet" size={16} color={Colors.textSecondary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Prix</Text>
              <Text style={styles.infoPriceValue}>
                {shipment.price != null ? `${shipment.price} TND` : 'À négocier'}
              </Text>
            </View>
          </View>
        </Card>

        {shipmentPhotos.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Photos du colis</Text>
            </View>
            <Card style={styles.photosCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photosScrollContent}
              >
                {shipmentPhotos.map((photo, index) => (
                  <Image
                    key={`${shipment.id}-photo-${index}`}
                    source={{ uri: photo }}
                    style={styles.photoThumb}
                  />
                ))}
              </ScrollView>
              {totalPhotos > shipmentPhotos.length && (
                <Text style={styles.photosCaption}>
                  {totalPhotos} photos enregistrées pour cette expédition.
                </Text>
              )}
            </Card>
          </>
        )}

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>Statut actuel</Text>
            <Badge status={badge.status} text={badge.text} />
          </View>

          {/* Timeline */}
          <View style={styles.timeline}>
            {['Créée', 'En transit', 'Livrée'].map((step, index) => {
              const stepStatus = getStepStatus(index, shipment.status);
              const level = STATUS_LEVEL[shipment.status] ?? 0;
              const isLast = index === 2;

              // Timestamps: step 0 always shows createdAt; the "current" step shows updatedAt
              let timestamp: string | null = null;
              if (stepStatus !== 'inactive') {
                if (index === 0) timestamp = formatDateTime(shipment.createdAt);
                else if (index === level) timestamp = formatDateTime(shipment.updatedAt);
              }

              return (
                <View key={step} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        stepStatus === 'completed' && styles.timelineDotCompleted,
                        stepStatus === 'active' && styles.timelineDotActive,
                      ]}
                    >
                      {stepStatus === 'completed' && (
                        <Text style={styles.timelineCheck}>✓</Text>
                      )}
                    </View>
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          stepStatus === 'completed' && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineText,
                        stepStatus === 'completed' && styles.timelineTextCompleted,
                        stepStatus === 'active' && styles.timelineTextActive,
                      ]}
                    >
                      {step}
                    </Text>
                    {timestamp && (
                      <Text style={styles.timelineTimestamp}>{timestamp}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Handover Confirmation (if HANDOVER_PENDING) */}
        {shipment.status === 'HANDOVER_PENDING' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Remise du colis</Text>
            </View>
            <Card style={styles.handoverCard}>
              <View style={styles.handoverHeader}>
                <AppIcon name="package" size={32} color={Colors.primary} />
                <View style={styles.handoverInfo}>
                  <Text style={styles.handoverTitle}>Le transporteur est arrivé</Text>
                  <Text style={styles.handoverSubtitle}>
                    Confirmez que vous avez remis le colis au transporteur pour qu'il puisse démarrer la livraison.
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.handoverButton}
                onPress={handleConfirmHandover}
                disabled={loading}
                activeOpacity={0.7}
              >
                <Text style={styles.handoverButtonText}>
                  {loading ? 'Confirmation...' : "J'ai remis le colis au transporteur"}
                </Text>
              </TouchableOpacity>
            </Card>
          </>
        )}
        
        {shipment.status === 'DELIVERED' && shipment.feedbackSummary?.canSubmit && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Votre évaluation</Text>
            </View>
            <Card style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>
                {shipment.feedbackSummary.hasSubmitted
                  ? 'Votre avis a déjà été enregistré'
                  : 'La livraison est terminée'}
              </Text>
              <Text style={styles.feedbackText}>
                {shipment.feedbackSummary.hasSubmitted
                  ? 'Vous pouvez ajuster votre note et votre commentaire sur ce transporteur.'
                  : 'Évaluez le transporteur pour finaliser cette expédition côté expérience client.'}
              </Text>
              <Button
                onPress={() => onNavigate?.('shipmentFeedback', {
                  shipmentId: shipment.id,
                  returnScreen: 'shipmentDetails',
                  returnParams: { id: shipment.id },
                })}
                size="lg"
                fullWidth
              >
                {shipment.feedbackSummary.hasSubmitted ? 'Modifier mon évaluation' : 'Évaluer le transporteur'}
              </Button>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {(shipment.status === 'PENDING' || shipment.status === 'REQUESTED') ? (
          <Button
            style={styles.cancelButton}
            onPress={handleCancelShipment}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler l'expédition</Text>
          </Button>
        ) : shipment.status === 'IN_TRANSIT' ? (
          <Button style={styles.trackButton} onPress={() => {}}>
            <Text style={styles.trackButtonText}>Suivre la livraison</Text>
          </Button>
        ) : (
          <Button onPress={() => onNavigate?.('dashboard')}>
            <Text style={styles.backButtonText}>Retour au dashboard</Text>
          </Button>
        )}
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
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  statusCard: {
    padding: 16,
    marginBottom: 24,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTimestamp: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  timelineDotActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  timelineCheck: {
    color: Colors.textInverse,
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: Colors.border,
  },
  timelineLineCompleted: {
    backgroundColor: Colors.primary,
  },
  timelineText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    paddingTop: 2,
  },
  timelineTextCompleted: {
    color: Colors.textPrimary,
    fontFamily: Fonts.semiBold,
  },
  timelineTextActive: {
    color: Colors.primary,
    fontFamily: Fonts.semiBold,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.charcoal,
  },
  infoCard: {
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    alignItems: 'center',
  },
  infoRowTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.sm + 4,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  infoPriceValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  infoDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  photosCard: {
    marginBottom: 24,
    padding: 16,
  },
  photosCaption: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    marginTop: 12,
  },
  photosScrollContent: {
    gap: 12,
  },
  photoThumb: {
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.md,
    height: 96,
    width: 96,
  },
  carrierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    marginBottom: 24,
  },
  carrierProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
  },
  carrierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrierAvatarText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textInverse,
  },
  carrierInfo: {
    flex: 1,
  },
  carrierName: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  carrierMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  carrierMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carrierRating: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  carrierLocation: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  profileArrow: {
    fontFamily: Fonts.regular,
    fontSize: 22,
    color: Colors.textMuted,
  },
  itinerary: {
    marginBottom: 4,
  },
  itineraryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  itineraryDotCol: {
    alignItems: 'center',
    width: 16,
    paddingTop: 4,
  },
  itineraryConnector: {
    width: 2,
    height: 28,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  dotGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
  },
  dotBlue: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.primary,
  },
  itineraryTextContent: {
    flex: 1,
    paddingBottom: 12,
  },
  requestCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  handoverCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  handoverHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  handoverInfo: {
    flex: 1,
  },
  handoverTitle: {
    fontFamily: Fonts.bold,
    fontSize: 15,
    color: Colors.primary,
    marginBottom: 6,
  },
  handoverSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  handoverButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  feedbackCard: {
    padding: 18,
    marginBottom: 8,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  feedbackTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  feedbackText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  handoverButtonText: {
    color: Colors.textInverse,
    fontFamily: Fonts.bold,
    fontSize: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestIconText: {
    fontSize: 24,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  requestSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
  },
  rejectButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.error,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.textInverse,
  },  bottomActions: {
    padding: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm + 4,
  },
  trackButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  trackButtonText: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontFamily: Fonts.semiBold,
    color: Colors.error,
    fontSize: 16,
  },
  backButtonText: {
    fontFamily: Fonts.semiBold,
    color: Colors.textInverse,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.error,
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButtonText: {
    fontFamily: Fonts.semiBold,
    color: Colors.textInverse,
    fontSize: 16,
  },
});

export default ShipmentDetailsScreen;
