import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
import { forgotPassword, resetPassword } from '../../../services/authService';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devToken, setDevToken] = useState(''); // For development mode

  const handleBack = () => {
    if (step === 'reset') {
      // Go back to the email step instead of leaving the screen
      setStep('email');
      setError('');
      setResetToken('');
    } else {
      onNavigate('login');
    }
  };

  const handleRequestReset = async () => {
    setError('');

    if (!email.trim()) {
      setError('Veuillez entrer votre email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email invalide');
      return;
    }

    try {
      setIsLoading(true);
      const result = await forgotPassword(email.trim());

      if (result.success) {
        if (result.resetToken) {
          setDevToken(result.resetToken);
        }
        // Single alert — embed the dev code in the message so it's visible immediately
        const alertMsg = result.resetToken
          ? `${result.message || 'Code généré.'}\n\n[🔧 Dev] Code : ${result.resetToken}`
          : (result.message || 'Si un compte existe avec cet email, un code a été envoyé');
        Alert.alert('Code envoyé', alertMsg, [{ text: 'OK', onPress: () => setStep('reset') }]);
      } else {
        setError(result.error || 'Erreur lors de la demande');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');

    if (!resetToken.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setIsLoading(true);
      const result = await resetPassword(email.trim(), resetToken.trim(), newPassword);

      if (result.success) {
        Alert.alert(
          'Succès',
          'Votre mot de passe a été réinitialisé avec succès',
          [{ text: 'OK', onPress: () => onNavigate('login') }]
        );
      } else {
        setError(result.error || 'Code invalide ou expiré');
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Back navigation bar — ← goes back to login (step email) or back to email step (step reset) */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.7}>
          <AppIcon name="arrow-left" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        {step === 'reset' && (
          <Text style={styles.topBarTitle}>Réinitialiser le mot de passe</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <AppIcon name="lock" size={40} color={Colors.navy} />
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>
            {step === 'email' ? 'Mot de passe oublié' : 'Réinitialiser le mot de passe'}
          </Text>
          
          <Text style={styles.subtitle}>
            {step === 'email' 
              ? 'Entrez votre email pour recevoir un code de réinitialisation'
              : 'Entrez le code reçu et votre nouveau mot de passe'
            }
          </Text>

          {error ? (
            <View style={styles.errorContainer}>
              <AppIcon name="alert-triangle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputs}>
            {step === 'email' ? (
              <>
                <Input
                  label="Email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  icon={<AppIcon name="email" size={18} color={Colors.textMuted} />}
                />
                
                <Button 
                  onPress={handleRequestReset} 
                  fullWidth 
                  size="lg" 
                  loading={isLoading} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Envoi...' : 'Envoyer le code'}
                </Button>
              </>
            ) : (
              <>
                <Input
                  label="Code de réinitialisation"
                  placeholder="123456"
                  value={resetToken}
                  onChangeText={setResetToken}
                  keyboardType="numeric"
                  maxLength={6}
                  icon={<AppIcon name="lock" size={18} color={Colors.textMuted} />}
                />

                {devToken && (
                  <Text style={styles.devHint}>
                    Dev: {devToken}
                  </Text>
                )}

                <Input
                  label="Nouveau mot de passe"
                  placeholder="••••••••"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  isPassword
                />

                <Input
                  label="Confirmer le mot de passe"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  isPassword
                />
                
                <Button 
                  onPress={handleResetPassword} 
                  fullWidth 
                  size="lg" 
                  loading={isLoading} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
                </Button>
              </>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous vous souvenez de votre mot de passe ?</Text>
            <TouchableOpacity onPress={() => onNavigate('login')} activeOpacity={0.7}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.primaryGlow,
  },
  form: { flex: 1 },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.navy,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorSurface,
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    fontFamily: Fonts.regular,
    color: Colors.error,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  inputs: {
    gap: 16,
    marginBottom: 24,
  },
  devHint: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: '#6366F1',
    textAlign: 'center',
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: Radius.xs,
    marginTop: -8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footerLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 8,
    minHeight: 52,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.navy,
    marginLeft: 12,
  },
});
