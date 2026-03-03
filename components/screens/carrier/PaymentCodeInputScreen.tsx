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
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import * as missionService from '../../../services/mission.service';

interface PaymentCodeInputScreenProps {
  route?: { params?: { missionId?: string; shipmentId?: string; amount?: number; clientName?: string; address?: string } };
  onNavigate?: (screen: string, params?: any) => void;
}

const PaymentCodeInputScreen: React.FC<PaymentCodeInputScreenProps> = ({
  route,
  onNavigate,
}) => {
  const missionId = route?.params?.missionId || '#12345';
  const shipmentId = route?.params?.shipmentId;
  const amount = route?.params?.amount || 45;
  const clientName = route?.params?.clientName || 'Ahmed Ben Ali';
  const address = route?.params?.address || '123 Rue de la République, Tunis';

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only last character
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

  const handleConfirmPayment = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length < 6) {
      Alert.alert('Code incomplet', 'Veuillez entrer les 6 chiffres du code');
      return;
    }

    if (!shipmentId) {
      Alert.alert('Erreur', 'ID de mission manquant');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Confirming delivery with code:', fullCode);
      
      const result = await missionService.confirmDelivery(shipmentId, fullCode);

      if (result.success) {
        // Code is correct, navigate to success screen
        onNavigate?.('paymentSuccess', {
          missionId,
          shipmentId,
          amount,
          clientName,
          receiptNumber: result.receiptNumber || `RCP${Math.floor(Math.random() * 1000)}`,
          mission: result.mission, // Pass the full mission data
        });
      } else {
        // Code is incorrect, navigate to error screen
        onNavigate?.('paymentError', {
          missionId,
          shipmentId,
          amount,
          clientName,
          address,
          attemptsLeft: result.attemptsLeft || 2,
        });
      }
    } catch (error) {
      console.error('Error confirming delivery:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setIsSubmitting(false);
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
            // Call API to resend code
            Alert.alert('Code renvoyé', 'Un nouveau code a été envoyé au client');
          },
        },
      ]
    );
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
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirmer la livraison</Text>
          <View style={styles.missionBadge}>
            <Text style={styles.missionBadgeText}>{missionId}</Text>
          </View>
        </View>

        {/* Order Summary Card */}
        <Card style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.packageIcon}>📦</Text>
            </View>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Livraison à</Text>
              <Text style={styles.orderAddress}>{address}</Text>
              
              <View style={styles.orderDetails}>
                <View style={styles.clientSection}>
                  <Text style={styles.orderLabel}>Client</Text>
                  <Text style={styles.orderValue}>{clientName}</Text>
                </View>
                <View style={styles.orderAmount}>
                  <Text style={styles.orderLabel}>À encaisser</Text>
                  <Text style={styles.amountValue}>{amount} DT</Text>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Instructions Banner */}
        <View style={styles.instructionBanner}>
          <Text style={styles.lightbulbIcon}>💡</Text>
          <View style={styles.instructionText}>
            <Text style={styles.instructionTitle}>Demandez le code de paiement</Text>
            <Text style={styles.instructionSubtitle}>
              Le client a reçu ce code par SMS lors de la commande.
            </Text>
          </View>
        </View>

        {/* Code Input */}
        <View style={styles.codeInputSection}>
          <Text style={styles.codeLabel}>Code de paiement</Text>
          <View style={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                ]}
                value={digit}
                onChangeText={value => handleCodeChange(index, value)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>
          <Text style={styles.codeHint}>Entrez le code à 6 chiffres</Text>
        </View>

        {/* Warning Text */}
        <Text style={styles.warningText}>
          Le client doit vous remettre l'argent avant de confirmer
        </Text>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleConfirmPayment}
          disabled={!isCodeComplete || isSubmitting}
          size="lg"
          fullWidth
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Confirmer paiement et livraison'
          )}
        </Button>
        <Button
          onPress={handleResendCode}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Renvoyer le code au client
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 150, // Space for fixed buttons
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  missionBadge: {
    backgroundColor: '#E9E9E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  missionBadgeText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  orderCard: {
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1464F6',
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageIcon: {
    fontSize: 24,
  },
  orderInfo: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  clientSection: {
    flex: 1,
  },
  orderValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1464F6',
  },
  instructionBanner: {
    flexDirection: 'row',
    backgroundColor: '#EBF2FE',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  lightbulbIcon: {
    fontSize: 20,
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1464F6',
    marginBottom: 4,
  },
  instructionSubtitle: {
    fontSize: 12,
    color: '#1464F6',
    lineHeight: 18,
  },
  codeInputSection: {
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 12,
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
  codeInputFilled: {
    borderColor: '#1464F6',
    backgroundColor: '#EBF2FE',
  },
  codeHint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
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

export default PaymentCodeInputScreen;
