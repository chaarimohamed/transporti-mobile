import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts, FontSizes } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
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
            <AppIcon name="check-circle" size={40} color={Colors.surface} />
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
    backgroundColor: Colors.background,
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
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 28,
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  bold: {
    fontFamily: Fonts.semiBold,
    color: Colors.textPrimary,
  },
  actions: {
    width: '100%',
    gap: 16,
  },
  primaryButtonText: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textInverse,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  secondaryButtonText: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default InvitationSentScreen;
