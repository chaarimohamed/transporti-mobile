import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Shipment,
  getShipmentById,
  submitShipmentFeedback,
} from '../../../services/shipment.service';

interface ShipmentFeedbackScreenProps {
  route?: {
    params?: {
      shipmentId?: string;
      returnScreen?: string;
      returnParams?: any;
    };
  };
  onNavigate?: (screen: string, params?: any) => void;
}

const ShipmentFeedbackScreen: React.FC<ShipmentFeedbackScreenProps> = ({ route, onNavigate }) => {
  const shipmentId = route?.params?.shipmentId;
  const returnScreen = route?.params?.returnScreen;
  const returnParams = route?.params?.returnParams;
  const { user } = useAuth();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const isSender = user?.role === 'sender';
  const existingRating = isSender
    ? shipment?.feedback?.senderToCarrierRating ?? 0
    : shipment?.feedback?.carrierToSenderRating ?? 0;
  const existingComment = isSender
    ? shipment?.feedback?.senderToCarrierComment ?? ''
    : shipment?.feedback?.carrierToSenderComment ?? '';

  useEffect(() => {
    if (!shipmentId) {
      setError('Expédition introuvable');
      setLoading(false);
      return;
    }

    const loadShipment = async () => {
      try {
        setLoading(true);
        setError('');

        const result = await getShipmentById(shipmentId);
        if (result.success && result.shipment) {
          setShipment(result.shipment);
        } else {
          setError(result.error || 'Impossible de charger l\'expédition');
        }
      } catch (loadError) {
        console.error('Error loading shipment feedback screen:', loadError);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    loadShipment();
  }, [shipmentId]);

  useEffect(() => {
    setRating(existingRating);
    setComment(existingComment);
  }, [existingRating, existingComment]);

  const targetName = isSender
    ? shipment?.carrier
      ? `${shipment.carrier.firstName} ${shipment.carrier.lastName}`
      : 'Transporteur'
    : shipment?.sender
      ? `${shipment.sender.firstName} ${shipment.sender.lastName}`
      : 'Expéditeur';
  const title = isSender ? 'Évaluer le transporteur' : 'Évaluer l\'expéditeur';
  const targetRoleLabel = isSender ? 'transporteur' : 'expéditeur';
  const canSubmit = shipment?.feedbackSummary?.canSubmit ?? false;
  const hasSubmitted = shipment?.feedbackSummary?.hasSubmitted ?? false;
  const pendingForCurrentUser = shipment?.feedbackSummary?.pendingForCurrentUser ?? false;

  const handleGoBack = () => {
    if (returnScreen) {
      onNavigate?.(returnScreen, returnParams);
      return;
    }

    onNavigate?.(isSender ? 'dashboard' : 'activeMissions');
  };

  const handleSubmit = async () => {
    if (!shipmentId) {
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert('Note requise', 'Veuillez sélectionner une note entre 1 et 5.');
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitShipmentFeedback(shipmentId, {
        rating,
        comment,
      });

      if (!result.success) {
        Alert.alert('Erreur', result.error || 'Impossible d\'enregistrer l\'évaluation');
        return;
      }

      onNavigate?.('shipmentFeedbackSuccess', {
        shipmentId,
        returnScreen,
        returnParams,
        rating,
        targetName,
        targetRoleLabel,
      });
    } catch (submitError) {
      console.error('Error submitting feedback:', submitError);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color="#1464F6" />
          <Text style={styles.stateText}>Chargement de l'évaluation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <Text style={styles.stateIcon}>⚠️</Text>
          <Text style={styles.stateTitle}>Impossible d'afficher cette évaluation</Text>
          <Text style={styles.stateText}>{error || 'Expédition introuvable'}</Text>
          <Button onPress={handleGoBack} size="lg">
            Retour
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Card style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>{shipment.refNumber}</Text>
          <Text style={styles.heroTitle}>{targetName}</Text>
          <Text style={styles.heroSubtitle}>
            {pendingForCurrentUser
              ? `La livraison est terminée. Partagez votre retour sur ce ${targetRoleLabel}.`
              : `Votre avis sur ce ${targetRoleLabel} peut encore être mis à jour.`}
          </Text>
          <View style={styles.routePillRow}>
            <View style={styles.routePill}>
              <Text style={styles.routePillLabel}>Départ</Text>
              <Text style={styles.routePillValue} numberOfLines={1}>{shipment.from}</Text>
            </View>
            <View style={styles.routePill}>
              <Text style={styles.routePillLabel}>Arrivée</Text>
              <Text style={styles.routePillValue} numberOfLines={1}>{shipment.to}</Text>
            </View>
          </View>
        </Card>

        {!canSubmit ? (
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>Évaluation indisponible</Text>
            <Text style={styles.infoText}>
              Cette évaluation sera disponible une fois la livraison terminée pour les deux parties.
            </Text>
          </Card>
        ) : (
          <>
            <Card style={styles.formCard}>
              <Text style={styles.sectionTitle}>Votre note</Text>
              <Text style={styles.sectionSubtitle}>
                Sélectionnez une note de 1 à 5 étoiles.
              </Text>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((value) => {
                  const active = value <= rating;
                  return (
                    <TouchableOpacity
                      key={value}
                      style={[styles.starButton, active && styles.starButtonActive]}
                      onPress={() => setRating(value)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.starText, active && styles.starTextActive]}>★</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.ratingCaption}>
                {rating === 0
                  ? 'Aucune note sélectionnée'
                  : rating === 5
                    ? 'Excellent'
                    : rating === 4
                      ? 'Très bien'
                      : rating === 3
                        ? 'Correct'
                        : rating === 2
                          ? 'Décevant'
                          : 'À améliorer'}
              </Text>

              <Text style={styles.sectionTitle}>Commentaire</Text>
              <Text style={styles.sectionSubtitle}>
                Facultatif, mais utile pour contextualiser votre évaluation.
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Décrivez votre expérience en quelques mots"
                placeholderTextColor="#8B8B8B"
                multiline
                maxLength={500}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
              />
              <Text style={styles.commentCount}>{comment.length}/500</Text>
            </Card>

            {hasSubmitted && (
              <Card style={styles.infoCard}>
                <Text style={styles.infoTitle}>Évaluation déjà envoyée</Text>
                <Text style={styles.infoText}>
                  Votre retour a déjà été enregistré. Vous pouvez encore l'ajuster si nécessaire.
                </Text>
              </Card>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleGoBack} variant="secondary" size="lg" fullWidth>
          Plus tard
        </Button>
        {canSubmit && (
          <Button onPress={handleSubmit} size="lg" fullWidth disabled={submitting || rating === 0}>
            {submitting
              ? 'Enregistrement...'
              : hasSubmitted
                ? 'Mettre à jour mon évaluation'
                : 'Envoyer mon évaluation'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F6F6',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 160,
  },
  heroCard: {
    marginBottom: 16,
    padding: 20,
    backgroundColor: '#0F172A',
    borderWidth: 0,
  },
  heroEyebrow: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#D7E3F4',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  routePillRow: {
    flexDirection: 'row',
    gap: 10,
  },
  routePill: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  routePillLabel: {
    color: '#A5B4C7',
    fontSize: 11,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  routePillValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    marginBottom: 16,
    padding: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  starButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  starButtonActive: {
    backgroundColor: '#FFF4CC',
    borderColor: '#F59E0B',
  },
  starText: {
    fontSize: 24,
    color: '#CBD5E1',
  },
  starTextActive: {
    color: '#F59E0B',
  },
  ratingCaption: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 22,
    textAlign: 'center',
  },
  commentInput: {
    minHeight: 132,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7DCE2',
    backgroundColor: '#FAFBFC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1A1A1A',
  },
  commentCount: {
    marginTop: 8,
    textAlign: 'right',
    fontSize: 12,
    color: '#8B8B8B',
  },
  infoCard: {
    marginBottom: 16,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderColor: '#E7EDF5',
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#52606D',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    gap: 10,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  stateText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 12,
  },
});

export default ShipmentFeedbackScreen;