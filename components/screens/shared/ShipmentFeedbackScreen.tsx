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
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
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
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.stateText}>Chargement de l'évaluation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.stateContainer}>
          <View style={{ marginBottom: 12 }}><AppIcon name="alert-triangle" size={28} color={Colors.primary} /></View>
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
          <AppIcon name="arrow-back" size={20} color={Colors.textPrimary} />
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  headerTitle: {
    flex: 1,
    marginLeft: Spacing.sm + 4,
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 160,
  },
  heroCard: {
    marginBottom: Spacing.md,
    padding: 20,
    backgroundColor: Colors.navy,
    borderWidth: 0,
  },
  heroEyebrow: {
    color: Colors.primaryLight,
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    color: Colors.textInverse,
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    color: Colors.placeholder,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
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
    padding: Spacing.sm + 4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  routePillLabel: {
    color: Colors.textMuted,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  routePillValue: {
    color: Colors.textInverse,
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
  },
  formCard: {
    marginBottom: Spacing.md,
    padding: 18,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    lineHeight: 18,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm + 4,
  },
  starButton: {
    width: 52,
    height: 52,
    borderRadius: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  starButtonActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  starText: {
    fontSize: 24,
    color: Colors.border,
  },
  starTextActive: {
    color: Colors.primary,
  },
  ratingCaption: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 22,
    textAlign: 'center',
  },
  commentInput: {
    minHeight: 132,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.backgroundAlt,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  commentCount: {
    marginTop: Spacing.sm,
    textAlign: 'right',
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
  infoCard: {
    marginBottom: Spacing.md,
    padding: 18,
    backgroundColor: Colors.surface,
    borderColor: Colors.borderLight,
    borderWidth: 1,
  },
  infoTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 15,
    color: Colors.navy,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm + 4,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  stateTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  stateText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginVertical: Spacing.sm + 4,
  },
});

export default ShipmentFeedbackScreen;