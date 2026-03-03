import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useAuth } from '../../../contexts/AuthContext';

interface SenderRegisterScreenProps {
  onNavigate: (screen: string) => void;
}

export const SenderRegisterScreen: React.FC<SenderRegisterScreenProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Clear previous errors
    setError('');

    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions d\'utilisation');
      return;
    }

    try {
      setIsLoading(true);
      const result = await register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        role: 'sender',
      });

      if (result.success) {
        // Will auto-login and navigate to dashboard via AuthContext
        onNavigate('dashboard');
      } else {
        setError(result.error || 'Échec de l\'inscription');
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
        <TouchableOpacity onPress={() => onNavigate('roleSelection')} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Compte Expéditeur</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Prénom"
                placeholder="Foulen"
                value={firstName}
                onChangeText={setFirstName}
                icon={<Text>👤</Text>}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Nom"
                placeholder="Ben Falten"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Input
            label="Téléphone"
            placeholder="+216 XX XXX XXX"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<Text>📱</Text>}
          />

          <Input
            label="Email"
            placeholder="foulen@exemple.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<Text>✉️</Text>}
          />

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword
          />

          <Input
            label="Confirmer mot de passe"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity 
              onPress={() => setAcceptedTerms(!acceptedTerms)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
                {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                J'accepte les{' '}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onNavigate('termsAndConditions', { returnScreen: 'senderRegister' })}>
              <Text style={styles.link}>Conditions générales</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{' '}et la{' '}</Text>
            <TouchableOpacity onPress={() => onNavigate('privacySecurity', { returnScreen: 'senderRegister' })}>
              <Text style={styles.link}>Politique de confidentialité</Text>
            </TouchableOpacity>
          </View>

          <Button onPress={handleRegister} fullWidth size="lg" disabled={!acceptedTerms || isLoading} loading={isLoading}>
            {isLoading ? 'Inscription...' : 'Créer mon compte'}
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
            <TouchableOpacity onPress={() => onNavigate('login')}>
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
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
  backIcon: {
    fontSize: 28,
    color: '#1A1A1A',
  },
  header: {
    marginTop: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
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
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#AFAFAF',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1464F6',
    borderColor: '#1464F6',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  link: {
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
  footerLink: {
    color: '#1464F6',
    fontSize: 14,
    fontWeight: '600',
  },
});
