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
import * as notificationService from '../../../services/notification.service';
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
      
      // Fetch applications, carriers, and notifications to get invited carriers
      const [applicationsResult, carriersResult, notificationsResult] = await Promise.all([
        shipmentService.getMyShipments(),
        shipmentService.getAvailableCarriers(shipmentId),
        notificationService.getNotifications(),
      ]);

      console.log('📊 Fetch results:', {
        applications: applicationsResult,
        carriers: carriersResult,
        notifications: notificationsResult,
      });

      // Filter applications for current shipment
      if (applicationsResult.success && applicationsResult.shipments) {
        const shipmentApplications = applicationsResult.shipments.filter(
          s => s.id === shipmentId && s.status === 'REQUESTED' && s.requestedCarrierId
        );
        setApplications(shipmentApplications);
      }

      // Get invited carrier IDs from notifications
      const invitedCarrierIds = new Set<string>();
      if (notificationsResult.success && notificationsResult.notifications) {
        const invitationNotifs = notificationsResult.notifications
          .filter(n => n.type === 'SHIPMENT_INVITATION' && n.shipmentId === shipmentId);
        
        console.log('🎯 Invitation notifications for this shipment:', invitationNotifs);
        
        invitationNotifs.forEach(n => {
          if (n.carrierId) invitedCarrierIds.add(n.carrierId);
        });
      }

      console.log('👥 Invited carrier IDs:', Array.from(invitedCarrierIds));

      // Filter out invited carriers - they should not appear in the list at all
      // Once a carrier is invited for this shipment, they are completely hidden
      if (carriersResult.success && carriersResult.carriers) {
        const available: Carrier[] = [];
        
        carriersResult.carriers.forEach(carrier => {
          // Exclude carriers who have been invited to this specific shipment
          if (!invitedCarrierIds.has(carrier.id)) {
            available.push(carrier);
          }
        });
        
        console.log('📋 Filtered carriers:', { 
          total: carriersResult.carriers.length,
          invited: invitedCarrierIds.size, 
          available: available.length 
        });
        
        // Only show carriers that haven't been invited
        setCarriers(available);
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
    onNavigate?.('transporterProfile', { transporter: carrier, shipmentId, shipmentRefNumber: currentShipment?.refNumber });
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
    const confirmMsg = 'Voulez-vous refuser ce transporteur ? L\'expédition sera supprimée.';
    
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
          <ActivityIndicator size="large" color="#1464F6" />
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
          onPress={() => onNavigate?.('dashboard')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
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
              {applications.map((application) => (
                <Card key={application.id} style={styles.applicationCard}>
                  <View style={styles.applicationHeader}>
                    <View style={styles.applicationAvatar}>
                      <Text style={styles.applicationAvatarText}>TR</Text>
                    </View>
                    <View style={styles.applicationInfo}>
                      <Text style={styles.applicationName}>Transporteur #{application.requestedCarrierId?.slice(0, 6)}</Text>
                      <View style={styles.applicationMeta}>
                        <Text style={styles.starIcon}>⭐</Text>
                        <Text style={styles.applicationRating}>4.8</Text>
                        <Text style={styles.applicationDivider}>•</Text>
                        <Text style={styles.applicationText}>En attente</Text>
                      </View>
                    </View>
                    <Text style={styles.applicationPrice}>{application.price} DT</Text>
                  </View>

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
              ))}
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
            {carriers.map((carrier) => (
            <Card key={carrier.id} style={styles.transporterCard}>
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
                  </View>

                  <View style={styles.contactInfo}>
                    {carrier.gouvernerat && (
                      <Text style={styles.contactText}>📍 {carrier.gouvernerat}</Text>
                    )}
                    <View style={styles.ratingContainer}>
                      <Text style={styles.starIcon}>⭐</Text>
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

              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => handleInviteTransporter(carrier)}
                activeOpacity={0.7}
              >
                <Text style={styles.inviteButtonText}>Inviter</Text>
              </TouchableOpacity>
            </Card>
          ))}
          </View>
        )}

        {/* Empty State */}
        {carriers.length === 0 && applications.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🚚</Text>
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
    backgroundColor: '#F6F6F6',
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
    backgroundColor: '#1464F6',
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
    color: '#1464F6',
  },
  applicationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1464F6',
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
    borderColor: '#D92D20',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D92D20',
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
    backgroundColor: '#1464F6',
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
    color: '#1464F6',
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
    borderColor: '#1464F6',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1464F6',
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
