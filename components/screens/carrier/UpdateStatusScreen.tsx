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
import * as missionService from '../../../services/mission.service';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface UpdateStatusScreenProps {
  route?: { params?: { id?: string } };
  onNavigate?: (screen: string, params?: any) => void;
}

type MissionStep = 'PICKUP' | 'HANDOVER_PENDING' | 'LOADING' | 'IN_TRANSIT' | 'DELIVERED';

interface StepConfig {
  key: MissionStep;
  label: string;
  icon: string;
  description: string;
}

const UpdateStatusScreen: React.FC<UpdateStatusScreenProps> = ({
  route,
  onNavigate,
}) => {
  const missionId = route?.params?.id;
  const [mission, setMission] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<MissionStep>('PICKUP');

  useEffect(() => {
    if (missionId) {
      fetchMissionDetails();
    }
  }, [missionId]);

  const fetchMissionDetails = async () => {
    if (!missionId) return;

    try {
      setLoading(true);
      setError('');

      const result = await shipmentService.getShipmentById(missionId);

      if (result.success && result.shipment) {
        console.log('📦 Shipment loaded:', result.shipment);
        console.log('📊 Shipment status:', result.shipment.status);
        setMission(result.shipment);
        
        // Determine current step based on shipment status
        if (result.shipment.status === 'CONFIRMED') {
          setCurrentStep('PICKUP');
        } else if (result.shipment.status === 'HANDOVER_PENDING') {
          setCurrentStep('HANDOVER_PENDING');
        } else if (result.shipment.status === 'IN_TRANSIT') {
          setCurrentStep('IN_TRANSIT');
        } else if (result.shipment.status === 'DELIVERED') {
          setCurrentStep('DELIVERED');
        }
      } else {
        setError(result.error || 'Mission introuvable');
      }
    } catch (err) {
      console.error('Error fetching mission:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMission = async () => {
    if (!missionId) {
      Alert.alert('Error', 'No mission ID found');
      return;
    }

    console.log('🚀 handleStartMission called with missionId:', missionId);

    const doStart = async () => {
      try {
        setSubmitting(true);
        console.log('📡 Calling updateMissionStatus...');
        const result = await missionService.updateMissionStatus(
          missionId,
          'IN_TRANSIT'
        );

        console.log('✅ Result:', result);

        if (result.success) {
          // Update the mission state immediately
          if (result.mission) {
            setMission(result.mission as unknown as Shipment);
          }
          // Backend now sets HANDOVER_PENDING (waiting for sender to confirm handover)
          setCurrentStep('HANDOVER_PENDING');
          console.log('✅ Status updated to HANDOVER_PENDING — awaiting sender confirmation');
          Alert.alert('Récupération confirmée', 'En attente de confirmation de l\'expéditeur.');
        } else {
          console.log('❌ Error:', result.error);
          Alert.alert('Erreur', result.error || 'Échec de la mise à jour');
        }
      } catch (err) {
        console.error('Error starting mission:', err);
        Alert.alert('Erreur', 'Erreur de connexion. Veuillez réessayer.');
      } finally {
        setSubmitting(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Confirmez-vous avoir récupéré la marchandise ?');
      if (confirmed) doStart();
    } else {
      Alert.alert(
        'Confirmer la récupération',
        'Confirmez-vous avoir récupéré la marchandise ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Confirmer', onPress: doStart },
        ]
      );
    }
  };

  const handleCompleteMission = () => {
    if (!missionId || !mission) return;

    // Navigate to payment code input screen
    const senderName = mission.sender
      ? `${mission.sender.firstName} ${mission.sender.lastName}`
      : 'Client';
    onNavigate?.('paymentCodeInput', {
      missionId: missionId,
      shipmentId: mission.id,
      amount: mission.price,
      clientName: senderName,
      address: mission.to,
    });
  };

  const isStepCompleted = (stepKey: MissionStep): boolean => {
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
    return stepIndex < currentStepIndex;
  };

  const isStepCurrent = (stepKey: MissionStep): boolean => {
    return stepKey === currentStep;
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

  if (error || !mission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onNavigate?.('activeMissions')}
            style={styles.backButton}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Suivi Mission</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Button onPress={fetchMissionDetails}>
            <Text style={{ color: '#FFF' }}>Réessayer</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const canStartMission = mission.status === 'CONFIRMED';
  const canCompleteMission = mission.status === 'IN_TRANSIT';
  const isCompleted = mission.status === 'DELIVERED';

  console.log('🔍 Debug flags:', {
    missionStatus: mission.status,
    canStartMission,
    canCompleteMission,
    isCompleted,
    currentStep,
  });

  const steps: StepConfig[] = [
    {
      key: 'PICKUP',
      label: 'À récupérer',
      icon: '📍',
      description: `${mission.from}`,
    },
    {
      key: 'HANDOVER_PENDING',
      label: 'Remise en cours',
      icon: '🤝',
      description: 'En attente de confirmation de l\'expéditeur',
    },
    {
      key: 'IN_TRANSIT',
      label: 'En route',
      icon: '🚚',
      description: 'Vers destination',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('activeMissions')}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi de mission</Text>
        <Badge status="neutral" text={mission.refNumber} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Mission Info Card */}
        <Card style={styles.infoCard}>
          <View style={styles.routeHeader}>
            <Text style={styles.routeText}>
              {mission.from} <Text style={styles.routeArrow}>→</Text> {mission.to}
            </Text>
            <Text style={styles.priceText}>{mission.price} TND</Text>
          </View>
          <Text style={styles.cargoText}>{mission.cargo || mission.description || 'Marchandise'}</Text>
        </Card>

        {/* Timeline */}
        <Card style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Suivi de mission</Text>

          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const completed = isStepCompleted(step.key);
              const current = isStepCurrent(step.key);
              const isLast = index === steps.length - 1;

              return (
                <View key={step.key} style={styles.timelineItem}>
                  <View style={styles.timelineContent}>
                    {/* Icon */}
                    <View
                      style={[
                        styles.timelineIcon,
                        completed && styles.timelineIconCompleted,
                        current && styles.timelineIconCurrent,
                      ]}
                    >
                      {completed ? (
                        <Text style={styles.checkmark}>✓</Text>
                      ) : (
                        <Text style={styles.stepIcon}>{step.icon}</Text>
                      )}
                    </View>

                    {/* Line */}
                    {!isLast && (
                      <View
                        style={[
                          styles.timelineLine,
                          completed && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>

                  {/* Details */}
                  <View style={styles.stepDetails}>
                    <Text
                      style={[
                        styles.stepLabel,
                        (completed || current) && styles.stepLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>

                    {/* Action buttons for current step */}
                    {current && !isCompleted && step.key === 'PICKUP' && canStartMission && (
                      <View style={styles.stepActions}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => {
                            console.log('🎯 Button pressed!');
                            handleStartMission();
                          }}
                          disabled={submitting}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.actionButtonText}>
                            {submitting ? 'Chargement...' : 'Confirmer la récupération'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {current && !isCompleted && step.key === 'HANDOVER_PENDING' && (
                      <View style={styles.stepActions}>
                        <View style={styles.waitingBadge}>
                          <Text style={styles.waitingText}>⏳ En attente de l'expéditeur</Text>
                        </View>
                        <Text style={styles.waitingSubText}>
                          L'expéditeur doit confirmer qu'il vous a remis le colis
                        </Text>
                      </View>
                    )}

                    {current && !isCompleted && step.key === 'IN_TRANSIT' && canCompleteMission && (
                      <View style={styles.stepActions}>
                        <Text style={styles.infoText}>
                          Confirmez la livraison en bas de l'écran
                        </Text>
                      </View>
                    )}

                    {completed && step.key === 'PICKUP' && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedText}>Récupération confirmée</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Status Message */}
        {isCompleted && (
          <Card style={styles.successCard}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>Mission complétée</Text>
            <Text style={styles.successText}>
              La mission a été livrée avec succès. Le paiement sera traité sous peu.
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Confirm Delivery Button - Always visible when not completed */}
      {!isCompleted && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !canCompleteMission && styles.buttonDisabled
            ]}
            onPress={handleCompleteMission}
            disabled={!canCompleteMission}
          >
            <Text style={styles.completeButtonText}>Confirmer la livraison</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: Colors.background,
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
  },
  infoCard: {
    marginBottom: 16,
    padding: 16,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  routeArrow: {
    color: '#999',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  cargoText: {
    fontSize: 14,
    color: '#666666',
  },
  timelineCard: {
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  timeline: {
    gap: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineContent: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineIconCompleted: {
    backgroundColor: '#2E8B57',
    borderColor: '#2E8B57',
  },
  timelineIconCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepIcon: {
    fontSize: 20,
  },
  checkmark: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E9E9E9',
    marginTop: -4,
  },
  timelineLineCompleted: {
    backgroundColor: '#2E8B57',
  },
  stepDetails: {
    flex: 1,
    paddingTop: 8,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 4,
  },
  stepLabelActive: {
    color: '#1A1A1A',
  },
  stepDescription: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  stepActions: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.primary,
    fontStyle: 'italic',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  completedText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  waitingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    marginBottom: 6,
  },
  waitingText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  waitingSubText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  successCard: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderColor: '#2E8B57',
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomButtonContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  completeButton: {
    backgroundColor: '#2E8B57',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
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
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default UpdateStatusScreen;
