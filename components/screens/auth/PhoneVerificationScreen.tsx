import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../ui/Button';
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
import { verifyPhone, resendOtp } from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';

interface PhoneVerificationScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  initialData: {
    userId: string;
    phone: string;
    role: 'sender' | 'carrier';
    nextScreen?: string; // defaults to 'dashboard'
  };
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export const PhoneVerificationScreen: React.FC<PhoneVerificationScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const { completeVerification } = useAuth();
  const { userId, phone, role, nextScreen = 'dashboard' } = initialData;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Start cooldown timer on mount (OTP was just sent)
  useEffect(() => {
    startCooldown();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const startCooldown = () => setCooldown(RESEND_COOLDOWN);

  const maskedPhone = phone.replace(/(\d{2})(\d{4})(\d{2})/, '+216 $1•••• $3');

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (digit && index === OTP_LENGTH - 1) {
      const fullOtp = [...newOtp.slice(0, OTP_LENGTH - 1), digit].join('');
      if (fullOtp.length === OTP_LENGTH) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      setError('Entrez les 6 chiffres du code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const result = await verifyPhone(userId, role, otpCode);

      if (result.success && result.user && result.token) {
        await completeVerification(result.user, result.token);
        onNavigate(nextScreen);
      } else {
        setError(result.error || 'Code invalide');
        // Clear inputs on wrong code
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      setIsLoading(true);
      setError('');
      const result = await resendOtp(userId, role);

      if (result.success) {
        startCooldown();
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        Alert.alert('Code envoyé', 'Un nouveau code a été envoyé à votre numéro.');
      } else {
        setError(result.error || 'Erreur lors de l\'envoi');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('back')}
          activeOpacity={0.7}
        >
          <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <AppIcon name="phone-portrait" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Vérification du numéro</Text>
          <Text style={styles.subtitle}>
            Entrez le code à 6 chiffres envoyé au
          </Text>
          <Text style={styles.phone}>{maskedPhone}</Text>
        </View>

        <View style={styles.otpContainer}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputRefs.current[i] = ref; }}
              style={[styles.otpInput, otp[i] ? styles.otpInputFilled : null, error ? styles.otpInputError : null]}
              value={otp[i]}
              onChangeText={(text) => handleDigitChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
            />
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Vérifier"
          onPress={() => handleVerify()}
          isLoading={isLoading}
          style={styles.verifyButton}
        />

        <TouchableOpacity
          onPress={handleResend}
          disabled={cooldown > 0 || isLoading}
          style={styles.resendContainer}
        >
          {cooldown > 0 ? (
            <Text style={styles.resendDisabled}>
              Renvoyer le code dans {cooldown}s
            </Text>
          ) : (
            <Text style={styles.resendLink}>Renvoyer le code</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight ?? '#EAF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.charcoal,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    textAlign: 'center',
  },
  phone: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.md,
    color: Colors.primary,
    marginTop: 4,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    textAlign: 'center',
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    color: Colors.charcoal,
    backgroundColor: Colors.white,
    ...Shadows.small,
  },
  otpInputFilled: {
    borderColor: Colors.primary,
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    marginBottom: 20,
  },
  resendContainer: {
    paddingVertical: 8,
  },
  resendLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  resendDisabled: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textLight,
  },
});
