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
import Badge from '../../ui/Badge';
import { AppIcon } from '../../ui/Icon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment, Carrier } from '../../../services/shipment.service';

interface SuggestedTransportersScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * M1: Top 5 Suggested Transporters Screen + Applications
 * Shows auto-matched transporters and carrier applications
 */
const SuggestedTransportersScreen: React.FC<SuggestedTransportersScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [loading, setLoading] = useState(true);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [invitedCarrierIds, setInvitedCarrierIds] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<Shipment[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const shipmentId = initialData?.shipmentId;
  const currentShipment = initialData?.shipment;

  useEffect(() => {
    fetchData();
  }, [initialData?.refresh]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!shipmentId) {
        console.error('No shipmentId provided');
        setLoading(false);
        return;
      }
      
      // Fetch applications, available carriers, and already-invited carrier IDs
      const [applicationsResult, carriersResult, invitedResult] = await Promise.all([
        shipmentService.getMyShipments(),
        shipmentService.getAvailableCarriers(shipmentId),
        shipmentService.getInvitedCarriers(shipmentId),
      ]);

      // Filter applications for current shipment
      if (applicationsResult.success && applicationsResult.shipments) {
        const shipmentApplications = applicationsResult.shipments.filter(
          s => s.id === shipmentId && s.status === 'REQUESTED' && s.requestedCarrierId
        );
        setApplications(shipmentApplications);
      }

      // Store invited carrier IDs from the dedicated endpoint
      const invitedIds = new Set<string>(
        (invitedResult.success ? invitedResult.carrierIds ?? [] : []) as string[]
      );
      setInvitedCarrierIds(invitedIds);

      // All carriers are shown; invited ones will be visually distinguished in the UI
      if (carriersResult.success && carriersResult.carriers) {
        setCarriers(carriersResult.carriers);
      } else if (carriersResult.error) {
        console.error('❌ Error fetching carriers:', carriersResult.error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleInviteTransporter = (carrier: Carrier) => {
    onNavigate?.('transporterProfile', { transporter: carrier, shipmentId, shipment: currentShipment, shipmentRefNumber: currentShipment?.refNumber });
  };

  const handleAcceptCarrier = async (shipment: Shipment) => {
    const confirmMsg = 'Voulez-vous accepter ce transporteur pour cette expédition ?';
    
    const onConfirm = async () => {
      try {
        setAcceptingId(shipment.id);
        const result = await shipmentService.acceptCarrier(shipment.id);

        if (result.success) {
          const successMsg = result.message || 'Transporteur accepté avec succès.';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert('Succès', successMsg);
          }
          // Refresh data
          await fetchData();
        } else {
          const errorMsg = result.error || 'Impossible d\'accepter le transporteur';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Erreur', errorMsg);
          }
        }
      } catch (err) {
        console.error('Error accepting carrier:', err);
        if (Platform.OS === 'web') {
          window.alert('Erreur de connexion');
        } else {
          Alert.alert('Erreur', 'Erreur de connexion');
        }
      } finally {
        setAcceptingId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Accepter le transporteur', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', style: 'default', onPress: onConfirm },
      ]);
    }
  };

  const handleRejectCarrier = async (shipment: Shipment) => {
    const confirmMsg = 'Voulez-vous refuser ce transporteur ? ';
    
    const onConfirm = async () => {
      try {
        setRejectingId(shipment.id);
        const result = await shipmentService.rejectCarrier(shipment.id);

        if (result.success) {
          const successMsg = result.message || 'Transporteur refusé.';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert('Succès', successMsg);
          }
          // Refresh data
          await fetchData();
        } else {
          const errorMsg = result.error || 'Impossible de refuser le transporteur';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Erreur', errorMsg);
          }
        }
      } catch (err) {
        console.error('Error rejecting carrier:', err);
        if (Platform.OS === 'web') {
          window.alert('Erreur de connexion');
        } else {
          Alert.alert('Erreur', 'Erreur de connexion');
        }
      } finally {
        setRejectingId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Refuser le transporteur', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Refuser', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Recherche des transporteurs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            shipmentId
              ? onNavigate?.('shipmentDetails', { id: shipmentId })
              : onNavigate?.('dashboard')
          }
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggestions</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Applications Section */}
        {applications.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Candidatures</Text>
              <Badge status="warning" text={`${applications.length}`} />
            </View>
            <Text style={styles.sectionSubtitle}>
              Des transporteurs ont postulé pour votre expédition
            </Text>

            <View style={styles.applicationsList}>
              {applications.map((application) => {
                const appCarrier = application.requestedCarrier;
                const initials = appCarrier
                  ? `${appCarrier.firstName?.[0] ?? ''}${appCarrier.lastName?.[0] ?? ''}`
                  : 'TR';
                return (
                <Card key={application.id} style={styles.applicationCard}>
                  {/* Tapping the carrier info navigates to their profile */}
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => appCarrier && onNavigate?.('transporterProfile', {
                      transporter: appCarrier,
                      shipmentId,
                      shipmentRefNumber: currentShipment?.refNumber,
                      shipmentStatus: currentShipment?.status,
                    })}
                  >
                    <View style={styles.applicationHeader}>
                      <View style={styles.applicationAvatar}>
                        <Text style={styles.applicationAvatarText}>{initials}</Text>
                      </View>
                      <View style={styles.applicationInfo}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={styles.applicationName}>
                            {appCarrier
                              ? `${appCarrier.firstName} ${appCarrier.lastName}`
                              : `Transporteur #${application.requestedCarrierId?.slice(0, 6)}`}
                          </Text>
                          {appCarrier && <AppIcon name="chevron-right" size={12} color={Colors.primary} />}
                        </View>
                        <View style={styles.applicationMeta}>
                          <AppIcon name="star-rating" size={14} color={Colors.warning} />
                          <Text style={styles.applicationRating}>
                            {appCarrier?.averageRating && appCarrier.averageRating > 0
                              ? appCarrier.averageRating.toFixed(1)
                              : 'N/A'}
                          </Text>
                          <Text style={styles.applicationDivider}>•</Text>
                          <Text style={styles.applicationText}>En attente</Text>
                        </View>
                        {appCarrier?.gouvernerat && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
                            <AppIcon name="location-pin" size={12} color={Colors.textMuted} />
                            <Text style={{ fontSize: 12, color: '#888' }}>{appCarrier.gouvernerat}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.applicationPrice}>{application.price} DT</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.applicationActions}>
                    <TouchableOpacity
                      style={[styles.rejectButton, rejectingId === application.id && styles.buttonDisabled]}
                      onPress={() => handleRejectCarrier(application)}
                      activeOpacity={0.7}
                      disabled={rejectingId === application.id || acceptingId === application.id}
                    >
                      {rejectingId === application.id ? (
                        <ActivityIndicator size="small" color="#D92D20" />
                      ) : (
                        <Text style={styles.rejectButtonText}>Refuser</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.acceptButton, acceptingId === application.id && styles.buttonDisabled]}
                      onPress={() => handleAcceptCarrier(application)}
                      activeOpacity={0.7}
                      disabled={acceptingId === application.id || rejectingId === application.id}
                    >
                      {acceptingId === application.id ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.acceptButtonText}>Accepter</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </Card>
                );
              })}
            </View>
          </View>
        )}

        {/* Title Section for Available Transporters */}
        {carriers.length > 0 && (
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>
              {applications.length > 0 ? 'Autres transporteurs disponibles' : `${carriers.length} Transporteurs disponibles`}
            </Text>
            <Text style={styles.subtitle}>Transporteurs inscrits sur la plateforme</Text>
          </View>
        )}

        {/* Transporter Cards */}
        {carriers.length > 0 && (
          <View style={styles.transportersList}>
            {carriers.map((carrier) => {
            const isInvited = invitedCarrierIds.has(carrier.id);
            return (
            <TouchableOpacity
              key={carrier.id}
              activeOpacity={0.75}
              onPress={() => onNavigate?.('transporterProfile', {
                transporter: carrier,
                shipmentId,
                shipment: currentShipment,
                shipmentRefNumber: currentShipment?.refNumber,
              })}
            >
            <Card style={[styles.transporterCard, isInvited && styles.transporterCardInvited]}>
              <View style={styles.cardContent}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {carrier.firstName[0]}{carrier.lastName[0]}
                  </Text>
                </View>

                <View style={styles.transporterInfo}>
                  <View style={styles.transporterHeader}>
                    <Text style={styles.transporterName}>
                      {carrier.firstName} {carrier.lastName}
                    </Text>
                    {isInvited && (
                      <View style={styles.invitedBadge}>
                        <Text style={styles.invitedBadgeText}>Déjà invité</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.contactInfo}>
                    {carrier.gouvernerat && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <AppIcon name="location-pin" size={12} color={Colors.textMuted} />
                        <Text style={styles.contactText}>{carrier.gouvernerat}</Text>
                      </View>
                    )}
                    <View style={styles.ratingContainer}>
                      <AppIcon name="star-rating" size={14} color={Colors.warning} />
                      <Text style={styles.contactText}>
                        {carrier.averageRating && carrier.averageRating > 0
                          ? `${carrier.averageRating.toFixed(1)} (${carrier.totalReviews || 0} avis)`
                          : 'Non évalué'
                        }
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {isInvited ? (
                <View style={styles.invitedButton}>
                  <Text style={styles.invitedButtonText}>Invitation envoyée</Text>
                </View>
              ) : (
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={(e) => { e.stopPropagation?.(); handleInviteTransporter(carrier); }}
                activeOpacity={0.7}
              >
                <Text style={styles.inviteButtonText}>Inviter</Text>
              </TouchableOpacity>
              )}
            </Card>
            </TouchableOpacity>
            );
          })}
          </View>
        )}

        {/* Empty State */}
        {carriers.length === 0 && applications.length === 0 && (
          <Card style={styles.emptyCard}>
            <AppIcon name="truck" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Aucun transporteur disponible</Text>
            <Text style={styles.emptyText}>Les transporteurs inscrits apparaîtront ici</Text>
          </Card>
        )}

        <View style={styles.bottomSpacer} />
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#444444',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  applicationsList: {
    gap: 16,
  },
  applicationCard: {
    padding: 16,
  },
  applicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  applicationAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applicationAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  applicationInfo: {
    flex: 1,
  },
  applicationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  applicationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applicationRating: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 4,
  },
  applicationDivider: {
    fontSize: 13,
    color: '#666666',
    marginHorizontal: 4,
  },
  applicationText: {
    fontSize: 13,
    color: '#666666',
  },
  applicationPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.error,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  titleSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  transportersList: {
    gap: 16,
  },
  transporterCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  transporterInfo: {
    flex: 1,
  },
  transporterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  transporterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  contactInfo: {
    gap: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    fontSize: 13,
    color: '#666666',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 4,
  },
  ratingDivider: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 4,
  },
  deliveriesText: {
    fontSize: 14,
    color: '#666666',
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  inviteButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  transporterCardInvited: {
    opacity: 0.85,
    borderColor: '#B0B0B0',
  },
  invitedBadge: {
    backgroundColor: '#E9F5E9',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  invitedBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2E7D32',
  },
  invitedButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  invitedButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#888888',
  },
  bottomSpacer: {
    height: 20,
  },  emptyCard: {
    padding: 40,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },});

export default SuggestedTransportersScreen;
