import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
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
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        {step === 'reset' && (
          <Text style={styles.topBarTitle}>Réinitialiser le mot de passe</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🔒</Text>
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
              <Text style={styles.errorText}>⚠️ {error}</Text>
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
                  icon={<Text>✉️</Text>}
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
                  keyboardType="number-pad"
                  maxLength={6}
                  icon={<Text>🔑</Text>}
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
    backgroundColor: '#FFFFFF',
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1464F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1464F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoIcon: {
    fontSize: 40,
  },
  form: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
  },
  inputs: {
    gap: 16,
    marginBottom: 24,
  },
  devHint: {
    fontSize: 12,
    color: '#6366F1',
    textAlign: 'center',
    backgroundColor: '#EEF2FF',
    padding: 8,
    borderRadius: 4,
    marginTop: -8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '600',
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 12,
  },
});
