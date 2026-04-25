import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AppIcon } from '../../ui/Icon';
import { BrandLogo } from '../../ui/BrandLogo';
import { useAuth } from '../../../contexts/AuthContext';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';

interface LoginScreenProps {
  onNavigate: (screen: string, params?: Record<string, unknown>) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login({ email: email.trim(), password });

      if (result.success) {
        // Navigation will happen automatically via AuthContext
        onNavigate('dashboard');
      } else {
        setError(result.error || 'Échec de la connexion');
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <BrandLogo width={320} height={160} style={styles.logo} />
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Connexion</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <AppIcon name="alert-triangle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.inputs}>
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={<AppIcon name="map-pin" size={18} color={Colors.textMuted} />}
            />

            <View>
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                isPassword
              />
              <TouchableOpacity 
                onPress={() => onNavigate('forgotPassword')}
                style={styles.forgotButton}
              >
                <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button onPress={handleLogin} fullWidth size="lg" loading={isLoading} disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas de compte ? </Text>
            <TouchableOpacity onPress={() => onNavigate('roleSelection')}>
              <Text style={styles.link}>Créer un compte</Text>
            </TouchableOpacity>
          </View>

          {/* Legal disclaimer — BUG-09: must be TouchableOpacity links, not plain Text */}
          <View style={styles.legalFooter}>
            <Text style={styles.legalText}>En continuant, vous acceptez nos </Text>
            <TouchableOpacity
              onPress={() => onNavigate('termsAndConditions', { returnScreen: 'login' })}
              activeOpacity={0.7}
            >
              <Text style={styles.legalLink}>Conditions générales</Text>
            </TouchableOpacity>
            <Text style={styles.legalText}> et notre </Text>
            <TouchableOpacity
              onPress={() => onNavigate('privacySecurity', { returnScreen: 'login' })}
              activeOpacity={0.7}
            >
              <Text style={styles.legalLink}>Politique de confidentialité</Text>
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
    padding: 24,
    paddingTop: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 12,
    ...Shadows.primaryGlow,
  },
  form: {
    gap: 24,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    color: Colors.charcoal,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.errorSurface,
    borderRadius: Radius.sm,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    fontFamily: Fonts.regular,
    color: Colors.error,
    fontSize: FontSizes.sm,
    flex: 1,
  },
  inputs: {
    gap: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.accent,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  link: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
  legalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  legalText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  legalLink: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    color: Colors.accent,
    lineHeight: 18,
  },
});
