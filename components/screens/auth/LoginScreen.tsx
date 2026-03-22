import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
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
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🚚</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.title}>Connexion</Text>

          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputs}>
            <Input
              label="Email"
              placeholder="exemple@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              icon={<Text>✉️</Text>}
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
    backgroundColor: '#fff',
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
    width: 64,
    height: 64,
    backgroundColor: '#1464F6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 32,
  },
  form: {
    gap: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorContainer: {
    backgroundColor: '#FEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    color: '#D92D20',
    fontSize: 14,
    textAlign: 'center',
  },
  inputs: {
    gap: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#1464F6',
    fontSize: 14,
    fontWeight: '600',
  },
  legalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  legalText: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 18,
  },
  legalLink: {
    fontSize: 12,
    color: '#1464F6',
    fontWeight: '500',
    lineHeight: 18,
  },
});
