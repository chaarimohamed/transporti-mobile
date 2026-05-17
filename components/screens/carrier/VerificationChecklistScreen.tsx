import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
import { useAuth } from '../../../contexts/AuthContext';
import { sendEmailOtp, verifyEmailOtp, getMe } from '../../../services/authService';

interface VerificationChecklistScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const VerificationChecklistScreen: React.FC<VerificationChecklistScreenProps> = ({
  onNavigate,
}) => {
  const { user, updateUser } = useAuth();

  const [verificationStatus, setVerificationStatus] = useState({
    phoneVerified: true, // always true (verified during registration)
    emailVerified: false,
    docsUploaded: false,
  });

  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const fetchStatus = async () => {
    try {
      setIsFetching(true);
      const result = await getMe();
      if (result.success && result.user) {
        const vs = (result.user as any).verificationStatus;
        if (vs) {
          setVerificationStatus(vs);
        }
      }
    } catch {
      // ignore
    } finally {
      setIsFetching(false);
    }
  };

  const completedCount = [
    verificationStatus.phoneVerified,
    verificationStatus.emailVerified,
    verificationStatus.docsUploaded,
  ].filter(Boolean).length;

  const handleSendEmailOtp = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await sendEmailOtp();
      if (result.success) {
        setShowEmailOtp(true);
        setCooldown(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(''));
        setTimeout(() => inputRefs.current[0]?.focus(), 300);
      } else {
        setError(result.error || 'Erreur');
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (digit && index === OTP_LENGTH - 1) {
      const fullOtp = [...newOtp.slice(0, OTP_LENGTH - 1), digit].join('');
      if (fullOtp.length === OTP_LENGTH) {
        handleVerifyEmail(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyEmail = async (code?: string) => {
    const otpCode = code ?? otp.join('');
    if (otpCode.length !== OTP_LENGTH) return;

    try {
      setIsLoading(true);
      setError('');
      const result = await verifyEmailOtp(otpCode);
      if (result.success) {
        setVerificationStatus((prev) => ({ ...prev, emailVerified: true }));
        setShowEmailOtp(false);
        Alert.alert('Succès', 'Votre email a été vérifié avec succès');
        // Refresh user data
        const meResult = await getMe();
        if (meResult.success && meResult.user) {
          await updateUser(meResult.user);
        }
      } else {
        setError(result.error || 'Code invalide');
        setOtp(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = (
    label: string,
    done: boolean,
    onPress?: () => void,
    subtitle?: string,
  ) => (
    <TouchableOpacity
      style={[styles.stepCard, done && styles.stepCardDone]}
      activeOpacity={done ? 1 : 0.7}
      onPress={done ? undefined : onPress}
      disabled={done || isLoading}
    >
      <View style={[styles.stepIcon, done ? styles.stepIconDone : styles.stepIconPending]}>
        <AppIcon
          name={done ? 'check-circle' : 'circle'}
          size={24}
          color={done ? Colors.success : Colors.textMuted}
        />
      </View>
      <View style={styles.stepContent}>
        <Text style={[styles.stepLabel, done && styles.stepLabelDone]}>{label}</Text>
        {subtitle && !done && (
          <Text style={styles.stepSubtitle}>{subtitle}</Text>
        )}
        {done && <Text style={styles.stepDoneText}>Vérifié</Text>}
      </View>
      {!done && (
        <AppIcon name="chevron-right" size={20} color={Colors.textMuted} />
      )}
    </TouchableOpacity>
  );

  if (isFetching) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate('dashboard')}
        >
          <AppIcon name="arrow-left" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vérification du profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>Progression</Text>
            <Text style={styles.progressValue}>{completedCount}/3</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(completedCount / 3) * 100}%` }]} />
          </View>
          {completedCount === 3 ? (
            <Text style={styles.progressComplete}>Profil vérifié — vous pouvez recevoir des missions</Text>
          ) : (
            <Text style={styles.progressHint}>
              Complétez toutes les étapes pour recevoir des missions
            </Text>
          )}
        </View>

        {/* Steps */}
        {renderStep(
          'Téléphone vérifié',
          verificationStatus.phoneVerified,
          undefined,
          'Vérifié lors de l\'inscription',
        )}

        {renderStep(
          'Email vérifié',
          verificationStatus.emailVerified,
          handleSendEmailOtp,
          'Recevez un code par email',
        )}

        {/* Email OTP input */}
        {showEmailOtp && !verificationStatus.emailVerified && (
          <View style={styles.otpCard}>
            <Text style={styles.otpTitle}>
              Code envoyé à <Text style={styles.otpEmail}>{user?.email}</Text>
            </Text>
            <View style={styles.otpRow}>
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(ref) => { inputRefs.current[i] = ref; }}
                  style={[styles.otpInput, error ? styles.otpInputError : null]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[i]}
                  onChangeText={(text) => handleDigitChange(text, i)}
                  onKeyPress={(e) => handleKeyPress(e, i)}
                  selectTextOnFocus
                />
              ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {isLoading && <ActivityIndicator style={{ marginTop: 12 }} color={Colors.primary} />}

            <TouchableOpacity
              style={styles.resendButton}
              disabled={cooldown > 0 || isLoading}
              onPress={handleSendEmailOtp}
            >
              <Text style={[styles.resendText, cooldown > 0 && styles.resendDisabled]}>
                {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : 'Renvoyer le code'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {renderStep(
          'Documents du véhicule',
          verificationStatus.docsUploaded,
          () => onNavigate('carrierDocuments'),
          'CIN et permis de conduire',
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.navy,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 20,
    marginBottom: 24,
    ...Shadows.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.navy,
  },
  progressValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.success,
    borderRadius: 4,
  },
  progressHint: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressComplete: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.success,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    marginBottom: 12,
    ...Shadows.sm,
  },
  stepCardDone: {
    backgroundColor: Colors.successSurface,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepIconDone: {
    backgroundColor: 'rgba(45, 158, 107, 0.15)',
  },
  stepIconPending: {
    backgroundColor: Colors.backgroundAlt,
  },
  stepContent: {
    flex: 1,
  },
  stepLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.navy,
  },
  stepLabelDone: {
    color: Colors.success,
  },
  stepSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stepDoneText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginTop: 2,
  },
  otpCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    ...Shadows.sm,
  },
  otpTitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  otpEmail: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xl,
    color: Colors.navy,
    backgroundColor: Colors.surface,
  },
  otpInputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.error,
    marginTop: 8,
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  resendText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  resendDisabled: {
    color: Colors.textMuted,
  },
});

export default VerificationChecklistScreen;
