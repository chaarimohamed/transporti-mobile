import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface MissionDetailsScreenProps {
  route?: { params?: { id?: string; shipmentId?: string; fromInvitation?: boolean } };
  onNavigate?: (screen: string, params?: any) => void;
}

const MissionDetailsScreen: React.FC<MissionDetailsScreenProps> = ({
  route,
  onNavigate,
}) => {
  // Try to get shipment ID from multiple possible sources
  const shipmentId = route?.params?.id || 
                     route?.params?.shipmentId || 
                     route?.params?.shipment?.id;
  const fromInvitation = route?.params?.fromInvitation || false;
  const [shipment, setShipment] = useState<Shipment | null>(route?.params?.shipment || null);
  const [loading, setLoading] = useState(!route?.params?.shipment);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (shipmentId) {
      console.log('🔍 Fetching shipment details for ID:', shipmentId);
      // Only fetch if we don't already have the shipment data
      if (!route?.params?.shipment) {
        fetchShipmentDetails();
      } else {
        console.log('✅ Shipment data already provided, skipping fetch');
        setLoading(false);
      }
    } else {
      console.error('❌ No shipment ID provided');
      setError('ID d\'expédition manquant');
      setLoading(false);
    }
  }, [shipmentId]);

  const fetchShipmentDetails = async () => {
    if (!shipmentId) {
      console.error('❌ No shipment ID in fetchShipmentDetails');
      setError('ID d\'expédition manquant');
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Calling shipment service for ID:', shipmentId);
      setLoading(true);
      setError('');

      const result = await shipmentService.getShipmentById(shipmentId);

      console.log('📥 Shipment service result:', result);

      if (result.success && result.shipment) {
        console.log('✅ Shipment loaded successfully:', result.shipment.refNumber);
        setShipment(result.shipment);
      } else {
        console.error('❌ Failed to load shipment:', result.error);
        setError(result.error || 'Expédition introuvable');
      }
    } catch (err) {
      console.error('❌ Error fetching shipment:', err);
      setError('Erreur de connexion');
    } finally {
      console.log('✅ Setting loading to false');
      setLoading(false);
    }
  };

  const handleAcceptShipment = async () => {
    if (!shipmentId) return;

    try {
      setSubmitting(true);

      const result = await shipmentService.requestShipment(shipmentId);

      if (result.success) {
        Alert.alert(
          'Succès',
          'Votre demande a été envoyée à l\'expéditeur. Vous serez notifié de sa décision.',
          [
            {
              text: 'OK',
              onPress: () => onNavigate?.('dashboard'),
            },
          ]
        );
      } else {
        // Show specific error message and offer to go back to list
        Alert.alert(
          'Erreur', 
          result.error || 'Échec de la demande',
          [
            {
              text: 'Retour à la liste',
              onPress: () => onNavigate?.('missionList'),
            },
          ]
        );
      }
    } catch (err) {
      console.error('Error requesting shipment:', err);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!shipmentId) return;

    try {
      setSubmitting(true);

      const result = await shipmentService.acceptInvitation(shipmentId);

      if (result.success) {
        Alert.alert(
          'Succès',
          'Invitation acceptée ! L\'expédition est maintenant confirmée.',
          [
            {
              text: 'OK',
              onPress: () => onNavigate?.('dashboard'),
            },
          ]
        );
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'acceptation');
      }
    } catch (err) {
      console.error('Error accepting invitation:', err);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefuseInvitation = () => {
    Alert.alert(
      'Refuser l\'invitation',
      'Êtes-vous sûr de vouloir refuser cette invitation ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Refuser',
          style: 'destructive',
          onPress: () => {
            // Just go back - notification will remain in list
            onNavigate?.('notificationList');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onNavigate?.('missionList')}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Détails Mission</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Button onPress={fetchShipmentDetails}>
            <Text style={{ color: '#FFF' }}>Réessayer</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('missionList')}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails Mission</Text>
        <Badge status="neutral" text={shipment.refNumber} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Sender Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Expéditeur</Text>
          <View style={styles.senderInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {shipment.sender?.firstName?.[0] || 'E'}
              </Text>
            </View>
            <View style={styles.senderDetails}>
              <Text style={styles.senderName}>
                {shipment.sender ? `${shipment.sender.firstName} ${shipment.sender.lastName}` : 'Expéditeur'}
              </Text>
              <Text style={styles.senderPhone}>{shipment.sender?.phone || '+216 XX XXX XXX'}</Text>
            </View>
          </View>
        </Card>

        {/* Route Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Itinéraire</Text>
          <View style={styles.route}>
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotStart]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Départ</Text>
                <Text style={styles.routeLocation}>{shipment.from}</Text>
                <Text style={styles.routeTime}>
                  {shipment.createdAt ? formatTime(shipment.createdAt) : 'Non spécifié'}
                </Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View style={[styles.routeDot, styles.routeDotEnd]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Arrivée</Text>
                <Text style={styles.routeLocation}>{shipment.to}</Text>
                <Text style={styles.routeTime}>
                  {shipment.createdAt
                    ? formatTime(new Date(new Date(shipment.createdAt).getTime() + 2.5 * 60 * 60 * 1000).toISOString())
                    : 'Non spécifié'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.routeMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Distance</Text>
              <Text style={styles.metaValue}>105 km</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Durée estimée</Text>
              <Text style={styles.metaValue}>2h 30</Text>
            </View>
          </View>
        </Card>

        {/* Cargo Info */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Cargaison</Text>
          <View style={styles.cargoInfo}>
            <Text style={styles.cargoType}>{shipment.cargo || shipment.description || 'Marchandise'}</Text>
            <Text style={styles.cargoDate}>
              Date d'enlèvement : {shipment.createdAt ? formatDate(shipment.createdAt) : 'Non spécifiée'}
            </Text>
          </View>
        </Card>

        {/* Price Section */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Tarif proposé</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.priceAmount}>{shipment.price} TND</Text>
            <Text style={styles.priceLabel}>Prix de la mission</Text>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons - Show different buttons based on context */}
      {fromInvitation && shipment.status === 'PENDING' ? (
        /* Invitation buttons */
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.refuseButton}
            onPress={handleRefuseInvitation}
            disabled={submitting}
          >
            <Text style={styles.refuseButtonText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, submitting && styles.buttonDisabled]}
            onPress={handleAcceptInvitation}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.acceptButtonText}>Accepter</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : shipment.status === 'PENDING' || shipment.status === 'REQUESTED' ? (
        /* Regular application buttons */
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.refuseButton}
            onPress={() => onNavigate?.('missionList')}
            disabled={submitting}
          >
            <Text style={styles.refuseButtonText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.acceptButton, submitting && styles.buttonDisabled]}
            onPress={handleAcceptShipment}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.acceptButtonText}>Postuler</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (shipment.status === 'CONFIRMED' || shipment.status === 'IN_TRANSIT') ? (
        /* Active mission button */
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.fullWidthButton}
            onPress={() => onNavigate?.('updateStatus', { id: shipment.id })}
          >
            <Text style={styles.fullWidthButtonText}>
              {shipment.status === 'CONFIRMED' ? 'Commencer la mission' : 'Mettre à jour le statut'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1464F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  senderDetails: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  senderPhone: {
    fontSize: 14,
    color: '#666666',
  },
  route: {
    marginBottom: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  routeDotStart: {
    backgroundColor: '#2E8B57',
  },
  routeDotEnd: {
    backgroundColor: '#1464F6',
  },
  routeInfo: {
    flex: 1,
    paddingBottom: 16,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  routeLocation: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  routeTime: {
    fontSize: 13,
    color: '#999999',
  },
  routeLine: {
    width: 2,
    height: 32,
    backgroundColor: '#E9E9E9',
    marginLeft: 5,
    marginVertical: -8,
  },
  routeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaDivider: {
    width: 1,
    backgroundColor: '#E9E9E9',
    marginHorizontal: 16,
  },
  metaLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cargoInfo: {
    gap: 8,
  },
  cargoType: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  cargoDate: {
    fontSize: 13,
    color: '#666666',
  },
  priceContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1464F6',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: '#666666',
  },
  counterOfferSection: {
    gap: 8,
  },
  counterOfferLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  counterOfferInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  counterOfferInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    paddingVertical: 12,
  },
  counterOfferCurrency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  refuseButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refuseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#1464F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  fullWidthButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#1464F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidthButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#D92D20',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default MissionDetailsScreen;
