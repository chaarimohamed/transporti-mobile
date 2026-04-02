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

  useEffect(() => {
    if (initialData?.id && !shipment) {
      fetchShipment(initialData.id);
    }
  }, [initialData?.id]);

  const fetchShipment = async (id: string) => {
    try {
      setLoading(true);
      const result = await shipmentService.getShipmentById(id);

      if (result.success && result.shipment) {
        setShipment(result.shipment);
      } else {
        setError(result.error || 'Erreur de chargement');
      }
    } catch (err) {
      console.error('Error fetching shipment:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
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

  const getStepStatus = (stepIndex: number, currentStatus: string): 'completed' | 'active' | 'inactive' => {
    const statusOrder = ['PENDING', 'IN_TRANSIT', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    
    if (stepIndex <= currentIndex) return 'completed';
    if (stepIndex === currentIndex + 1) return 'active';
    return 'inactive';
  };

  const handleCancelShipment = () => {
    const alertFn = Platform.OS === 'web' ? window.confirm : Alert.alert;
    
    if (Platform.OS === 'web') {
      if (alertFn('Êtes-vous sûr de vouloir annuler cette expédition ?')) {
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

  const handleAcceptCarrier = async () => {
    if (!shipment) return;

    const confirmMsg = 'Voulez-vous accepter ce transporteur ?';
    
    const onConfirm = async () => {
      try {
        setLoading(true);
        const result = await shipmentService.acceptCarrier(shipment.id);

        if (result.success) {
          // Refresh shipment data
          await fetchShipment(shipment.id);
          const successMsg = result.message || 'Transporteur accepté avec succès';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert('Succès', successMsg);
          }
        } else {
          const errorMsg = result.error || 'Impossible d\'accepter';
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
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Accepter le transporteur', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', onPress: onConfirm },
      ]);
    }
  };

  const handleRejectCarrier = async () => {
    if (!shipment) return;

    const confirmMsg = 'Voulez-vous refuser ce transporteur ?';
    
    const onConfirm = async () => {
      try {
        setLoading(true);
        const result = await shipmentService.rejectCarrier(shipment.id);

        if (result.success) {
          // Refresh shipment data
          await fetchShipment(shipment.id);
          const successMsg = result.message || 'Transporteur refusé';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
          } else {
            Alert.alert('Succès', successMsg);
          }
        } else {
          const errorMsg = result.error || 'Impossible de refuser';
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
        setLoading(false);
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
          <ActivityIndicator size="large" color="#1464F6" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error || 'Expédition introuvable'}</Text>
          <Button onPress={() => onNavigate?.('dashboard')}>
            <Text style={styles.errorButtonText}>Retour</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const badge = getStatusBadge(shipment.status);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('dashboard')}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails {shipment.refNumber}</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
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
              const isLast = index === 2;

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
                  <Text
                    style={[
                      styles.timelineText,
                      stepStatus === 'completed' && styles.timelineTextCompleted,
                      stepStatus === 'active' && styles.timelineTextActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Information Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Informations</Text>
        </View>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Départ</Text>
              <Text style={styles.infoValue}>{shipment.from}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Arrivée</Text>
              <Text style={styles.infoValue}>{shipment.to}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📦</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Type de colis</Text>
              <Text style={styles.infoValue}>{shipment.cargo || 'Colis'}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>💰</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Prix</Text>
              <Text style={styles.infoPriceValue}>{shipment.price} TND</Text>
            </View>
          </View>
        </Card>

        {/* Carrier Request (if REQUESTED status) */}
        {shipment.status === 'REQUESTED' && shipment.requestedCarrierId && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Demande de transporteur</Text>
            </View>
            <Card style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.requestIcon}>
                  <Text style={styles.requestIconText}>👤</Text>
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>Un transporteur souhaite prendre cette expédition</Text>
                  <Text style={styles.requestSubtitle}>En attente de votre décision</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.viewApplicationButton}
                onPress={() => onNavigate?.('applicationDetails', { shipment })}
                activeOpacity={0.7}
              >
                <Text style={styles.viewApplicationButtonText}>👁 Voir la candidature →</Text>
              </TouchableOpacity>
              
              <View style={styles.requestActions}>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={handleRejectCarrier}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.rejectButtonText}>Refuser</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={handleAcceptCarrier}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text style={styles.acceptButtonText}>Accepter</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </>
        )}

        {/* Carrier Info (if assigned) */}
        {shipment.carrier && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transporteur</Text>
            </View>
            <Card style={styles.carrierCard}>
              <View style={styles.carrierIcon}>
                <Text style={styles.carrierIconText}>👤</Text>
              </View>
              <View style={styles.carrierInfo}>
                <Text style={styles.carrierName}>
                  {shipment.carrier.firstName} {shipment.carrier.lastName}
                </Text>
                <Text style={styles.carrierRating}>⭐ 4.8 (124 courses)</Text>
              </View>
              <TouchableOpacity style={styles.phoneButton}>
                <Text style={styles.phoneIcon}>📞</Text>
              </TouchableOpacity>
            </Card>
          </>
        )}

        {/* Handover Confirmation (if HANDOVER_PENDING) */}
        {shipment.status === 'HANDOVER_PENDING' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Remise du colis</Text>
            </View>
            <Card style={styles.handoverCard}>
              <View style={styles.handoverHeader}>
                <Text style={styles.handoverIcon}>🤝</Text>
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
                  {loading ? 'Confirmation...' : '✅ J\'ai remis le colis au transporteur'}
                </Text>
              </TouchableOpacity>
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
    backgroundColor: '#F6F6F6',
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
    gap: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
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
    fontSize: 14,
    color: '#666666',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  timelineLeft: {
    alignItems: 'center',
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotCompleted: {
    borderColor: '#1464F6',
    backgroundColor: '#1464F6',
  },
  timelineDotActive: {
    borderColor: '#1464F6',
    backgroundColor: '#FFFFFF',
  },
  timelineCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E9E9E9',
  },
  timelineLineCompleted: {
    backgroundColor: '#1464F6',
  },
  timelineText: {
    fontSize: 14,
    color: '#999',
    paddingTop: 2,
  },
  timelineTextCompleted: {
    color: '#1A1A1A',
    fontWeight: '600',
  },
  timelineTextActive: {
    color: '#1464F6',
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444444',
  },
  infoCard: {
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  infoPriceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1464F6',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#E9E9E9',
    marginVertical: 16,
  },
  carrierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  carrierIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrierIconText: {
    fontSize: 24,
  },
  carrierInfo: {
    flex: 1,
  },
  carrierName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  carrierRating: {
    fontSize: 12,
    color: '#666666',
  },
  phoneButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1464F6' + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    fontSize: 20,
  },
  requestCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  handoverCard: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#1464F6',
  },
  handoverHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  handoverIcon: {
    fontSize: 32,
  },
  handoverInfo: {
    flex: 1,
  },
  handoverTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1464F6',
    marginBottom: 6,
  },
  handoverSubtitle: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 19,
  },
  handoverButton: {
    backgroundColor: '#1464F6',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  handoverButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
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
    backgroundColor: '#FFFFFF',
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
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  requestSubtitle: {
    fontSize: 13,
    color: '#666666',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D92D20',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D92D20',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1464F6',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },  bottomActions: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    gap: 12,
  },
  trackButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1464F6',
  },
  trackButtonText: {
    color: '#1464F6',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D92D20',
  },
  cancelButtonText: {
    color: '#D92D20',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#D92D20',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ShipmentDetailsScreen;
