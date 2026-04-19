import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';

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
          <Text style={styles.iconText}>✓</Text>
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
    backgroundColor: '#FFFDF8',
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
    backgroundColor: '#DFF6E9',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 42,
    color: '#1F8A5B',
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#5C6773',
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
    color: '#D0D7DE',
  },
  starActive: {
    color: '#F59E0B',
  },
  summaryCard: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E6D5',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#5C6773',
    marginBottom: 10,
  },
  summaryMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A16207',
    textTransform: 'capitalize',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#EEE5D9',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
});

export default ShipmentFeedbackSuccessScreen;