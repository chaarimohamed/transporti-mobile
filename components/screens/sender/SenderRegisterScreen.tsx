import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../../theme';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { AppIcon } from '../../ui/Icon';
import { useAuth } from '../../../contexts/AuthContext';

interface SenderRegisterScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  initialData?: any;
}

// Validation helpers (same rules as CarrierRegisterScreen)
const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
// Tunisian phone: 8 digits, optionally prefixed by +216 (with optional space/dash)
const isValidPhone = (val: string) => /^(\+216[\s-]?)?\d{8}$/.test(val.replace(/\s/g, ''));
// Strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
const isStrongPassword = (val: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(val);

export const SenderRegisterScreen: React.FC<SenderRegisterScreenProps> = ({ onNavigate, initialData }) => {
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Restore form data when returning from Terms / Privacy screens
  useEffect(() => {
    if (initialData?.formData) {
      const fd = initialData.formData;
      if (fd.firstName !== undefined) setFirstName(fd.firstName);
      if (fd.lastName !== undefined) setLastName(fd.lastName);
      if (fd.phone !== undefined) setPhone(fd.phone);
      if (fd.email !== undefined) setEmail(fd.email);
      if (fd.password !== undefined) setPassword(fd.password);
      if (fd.confirmPassword !== undefined) setConfirmPassword(fd.confirmPassword);
      if (fd.acceptedTerms !== undefined) setAcceptedTerms(fd.acceptedTerms);
    }
  }, []);

  const currentFormData = () => ({
    firstName, lastName, phone, email, password, confirmPassword, acceptedTerms,
  });

  const handleRegister = async () => {
    setError('');

    // Per-field validation
    const errors: Record<string, string> = {};

    if (!firstName.trim()) errors.firstName = 'Le prénom est obligatoire';
    if (!lastName.trim()) errors.lastName = 'Le nom est obligatoire';

    if (!phone.trim()) {
      errors.phone = 'Le numéro de téléphone est obligatoire';
    } else if (!isValidPhone(phone)) {
      errors.phone = 'Numéro invalide — 8 chiffres requis (ex: +216 20 123 456)';
    }

    if (!email.trim()) {
      errors.email = "L'email est obligatoire";
    } else if (!isValidEmail(email)) {
      errors.email = 'Adresse email invalide';
    }

    if (!password) {
      errors.password = 'Le mot de passe est obligatoire';
    } else if (!isStrongPassword(password)) {
      errors.password = 'Min. 8 caractères avec majuscule, chiffre et caractère spécial';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Veuillez corriger les erreurs ci-dessous');
      return;
    }

    setFieldErrors({});

    if (!acceptedTerms) {
      setError("Vous devez accepter les conditions d'utilisation");
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
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Compte Expéditeur</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorRow}>
              <AppIcon name="alert-triangle" size={16} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Prénom"
                placeholder="Foulen"
                value={firstName}
                onChangeText={(v) => { setFirstName(v); setFieldErrors(e => ({ ...e, firstName: '' })); }}
                icon={<AppIcon name="profile-user" size={18} color={Colors.textMuted} />}
              />
              {fieldErrors.firstName ? <Text style={styles.fieldError}>{fieldErrors.firstName}</Text> : null}
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Nom"
                placeholder="Ben Falten"
                value={lastName}
                onChangeText={(v) => { setLastName(v); setFieldErrors(e => ({ ...e, lastName: '' })); }}
              />
              {fieldErrors.lastName ? <Text style={styles.fieldError}>{fieldErrors.lastName}</Text> : null}
            </View>
          </View>

          <Input
            label="Téléphone"
            placeholder="+216 XX XXX XXX"
            value={phone}
            onChangeText={(v) => { setPhone(v); setFieldErrors(e => ({ ...e, phone: '' })); }}
            keyboardType="phone-pad"
            icon={<AppIcon name="phone" size={18} color={Colors.textMuted} />}
          />
          {fieldErrors.phone ? <Text style={styles.fieldError}>{fieldErrors.phone}</Text> : null}

          <Input
            label="Email"
            placeholder="foulen@exemple.com"
            value={email}
            onChangeText={(v) => { setEmail(v); setFieldErrors(e => ({ ...e, email: '' })); }}
            keyboardType="email-address"
            icon={<AppIcon name="email" size={18} color={Colors.textMuted} />}
          />
          {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}

          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={(v) => { setPassword(v); setFieldErrors(e => ({ ...e, password: '' })); }}
            isPassword
          />
          {fieldErrors.password ? <Text style={styles.fieldError}>{fieldErrors.password}</Text> : null}

          <Input
            label="Confirmer mot de passe"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(v) => { setConfirmPassword(v); setFieldErrors(e => ({ ...e, confirmPassword: '' })); }}
            isPassword
          />
          {fieldErrors.confirmPassword ? <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text> : null}

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
            <TouchableOpacity onPress={() => onNavigate('termsAndConditions', { returnScreen: 'senderRegister', formData: currentFormData() })}>
              <Text style={styles.link}>Conditions générales</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{' '}et la{' '}</Text>
            <TouchableOpacity onPress={() => onNavigate('privacySecurity', { returnScreen: 'senderRegister', formData: currentFormData() })}>
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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  errorText: {
    color: Colors.error,
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
  fieldError: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
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
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
    color: Colors.primary,
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
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
