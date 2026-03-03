import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Button } from '../../ui/Button';

interface InvitationSentScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * M3: Invitation Sent Screen
 * Confirmation screen after inviting a transporter
 */
const InvitationSentScreen: React.FC<InvitationSentScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const transporter = initialData?.transporter;
  const transporterName = transporter 
    ? `${transporter.firstName} ${transporter.lastName}`
    : 'le transporteur';

  const handleBackToDashboard = () => {
    onNavigate?.('dashboard');
  };

  const handleInviteAnother = () => {
    const shipmentId = initialData?.shipmentId;
    onNavigate?.('suggestedTransporters', { shipmentId, refresh: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Invitation envoyée !</Text>

        {/* Message */}
        <Text style={styles.message}>
          Le transporteur <Text style={styles.bold}>{transporterName}</Text> a été notifié. 
          Vous recevrez une réponse sous 24h.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <Button onPress={handleBackToDashboard}>
            <Text style={styles.primaryButtonText}>Retour au dashboard</Text>
          </Button>

          <Button 
            onPress={handleInviteAnother}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Inviter un autre transporteur</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2E8B57',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  bold: {
    fontWeight: '700',
    color: '#1A1A1A',
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
});

export default InvitationSentScreen;
