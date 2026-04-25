import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { Colors, Fonts, FontSizes, Radius } from '../../../theme';
import { AppIcon } from '../../ui/Icon';

interface ShipmentFeedbackSuccessScreenProps {
  route?: {
    params?: {
      shipmentId?: string;
      returnScreen?: string;
      returnParams?: any;
      rating?: number;
      targetName?: string;
      targetRoleLabel?: string;
    };
  };
  onNavigate?: (screen: string, params?: any) => void;
}

const ShipmentFeedbackSuccessScreen: React.FC<ShipmentFeedbackSuccessScreenProps> = ({
  route,
  onNavigate,
}) => {
  const { user } = useAuth();
  const rating = route?.params?.rating || 0;
  const targetName = route?.params?.targetName || 'Utilisateur';
  const targetRoleLabel = route?.params?.targetRoleLabel || 'utilisateur';
  const returnScreen = route?.params?.returnScreen;
  const returnParams = route?.params?.returnParams;

  const handleReturn = () => {
    if (returnScreen) {
      onNavigate?.(returnScreen, returnParams);
      return;
    }

    onNavigate?.(user?.role === 'sender' ? 'dashboard' : 'activeMissions');
  };

  const handleEdit = () => {
    onNavigate?.('shipmentFeedback', {
      shipmentId: route?.params?.shipmentId,
      returnScreen,
      returnParams,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <AppIcon name="check-circle" size={42} color={Colors.success} />
        </View>

        <Text style={styles.title}>Évaluation enregistrée</Text>
        <Text style={styles.subtitle}>
          Votre retour sur {targetName} a bien été pris en compte.
        </Text>

        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Text key={value} style={[styles.star, value <= rating && styles.starActive]}>
              ★
            </Text>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Merci pour votre retour</Text>
          <Text style={styles.summaryText}>
            Ces évaluations permettent d'améliorer la qualité des futures livraisons et la confiance entre expéditeurs et transporteurs.
          </Text>
          <Text style={styles.summaryMeta}>Cible évaluée : {targetRoleLabel}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button onPress={handleEdit} variant="secondary" size="lg" fullWidth>
          Modifier mon évaluation
        </Button>
        <Button onPress={handleReturn} size="lg" fullWidth>
          Terminer
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 158, 107, 0.12)',
    marginBottom: 24,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 26,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 28,
  },
  star: {
    fontSize: 28,
    color: Colors.border,
  },
  starActive: {
    color: Colors.primary,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  summaryText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    lineHeight: 21,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  summaryMeta: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primaryDark,
    textTransform: 'capitalize',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    gap: 10,
  },
});

export default ShipmentFeedbackSuccessScreen;