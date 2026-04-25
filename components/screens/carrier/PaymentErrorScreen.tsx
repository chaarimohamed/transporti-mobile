import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import { AppIcon } from '../../ui/Icon';

interface PaymentErrorScreenProps {
  route?: { 
    params?: { 
      missionId?: string; 
      shipmentId?: string; 
      amount?: number; 
      clientName?: string; 
      address?: string;
      attemptsLeft?: number;
    } 
  };
  onNavigate?: (screen: string, params?: any) => void;
}

const PaymentErrorScreen: React.FC<PaymentErrorScreenProps> = ({
  route,
  onNavigate,
}) => {
  const missionId = route?.params?.missionId || '#12345';
  const shipmentId = route?.params?.shipmentId;
  const amount = route?.params?.amount || 45;
  const clientName = route?.params?.clientName || 'Ahmed Ben Ali';
  const address = route?.params?.address || '123 Rue de la République, Tunis';
  const initialAttemptsLeft = route?.params?.attemptsLeft || 2;

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttemptsLeft);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleRetry = () => {
    const fullCode = code.join('');
    
    if (fullCode.length < 6) {
      Alert.alert('Code incomplet', 'Veuillez entrer les 6 chiffres du code');
      return;
    }

    // Validate code (000000 for now)
    console.log('Retrying with code:', fullCode, 'Attempts left:', attemptsLeft);

    if (fullCode === '000000') {
      // Code is correct, navigate to success screen
      if (onNavigate) {
        onNavigate('paymentSuccess', {
          missionId,
          shipmentId,
          amount,
          clientName,
          receiptNumber: `RCP${Math.floor(Math.random() * 1000)}`,
        });
      }
    } else {
      // Code is still incorrect
      if (attemptsLeft > 1) {
        // Still has attempts remaining, show error and reduce count
        const newAttemptsLeft = attemptsLeft - 1;
        Alert.alert('Code incorrect', `Vérifiez le code avec le client. ${newAttemptsLeft} tentative(s) restante(s)`);
        setCode(Array(6).fill(''));
        setAttemptsLeft(newAttemptsLeft);
      } else {
        // No more attempts, navigate to blocked screen
        if (onNavigate) {
          onNavigate('paymentBlocked', {
            missionId,
            shipmentId,
            amount,
          });
        }
      }
    }
  };

  const handleResendCode = () => {
    Alert.alert(
      'Renvoyer le code',
      'Un nouveau code sera envoyé au client par SMS',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            Alert.alert('Code renvoyé', 'Un nouveau code a été envoyé au client');
            setCode(Array(6).fill(''));
          },
        },
      ]
    );
  };

  const handleReportProblem = () => {
    if (onNavigate) {
      onNavigate('paymentIssue', {
        missionId,
        shipmentId,
        amount,
        clientName,
      });
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate?.('activeMissions')}
          >
            <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmer la livraison</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Error Banner */}
        <View style={styles.errorBanner}>
          <AppIcon name="alert-triangle" size={24} color={Colors.error} />
          <View style={styles.errorText}>
            <Text style={styles.errorTitle}>Code incorrect</Text>
            <Text style={styles.errorSubtitle}>
              Vérifiez le code avec le client.
            </Text>
          </View>
        </View>

        {/* Code Input with Error State */}
        <View style={styles.codeInputSection}>
          <View style={styles.codeLabelRow}>
            <Text style={styles.codeLabel}>Code de paiement</Text>
            <Text style={styles.attemptsText}>
              {attemptsLeft}/3 tentatives restantes
            </Text>
          </View>
          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[styles.codeInput, styles.codeInputError]}
                value={digit}
                onChangeText={value => handleCodeChange(index, value)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          <View style={styles.errorMessageRow}>
            <AppIcon name="alert-triangle" size={14} color={Colors.error} />
            <Text style={styles.errorMessage}>Code invalide</Text>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleRetry}
          disabled={!isCodeComplete}
          size="lg"
          fullWidth
        >
          Réessayer
        </Button>
        <Button
          onPress={handleResendCode}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Renvoyer le code au client
        </Button>
        <Button
          onPress={handleReportProblem}
          variant="outline"
          size="lg"
          fullWidth
        >
          Signaler un problème
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 200, // Space for fixed buttons (3 buttons)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: '#FCE4E4',
    borderWidth: 1,
    borderColor: 'rgba(217, 45, 32, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorText: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 12,
    color: Colors.error,
    lineHeight: 18,
  },
  codeInputSection: {
    marginBottom: 16,
  },
  codeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
  },
  attemptsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB347',
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  codeInputError: {
    borderColor: Colors.error,
    backgroundColor: '#FCE4E4',
    color: Colors.error,
  },
  errorMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  errorMessageIcon: {
    fontSize: 12,
    color: Colors.error,
  },
  errorMessage: {
    fontSize: 12,
    color: Colors.error,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    gap: 12,
  },
});

export default PaymentErrorScreen;
