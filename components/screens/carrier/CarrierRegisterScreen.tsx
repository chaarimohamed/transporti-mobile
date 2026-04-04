import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Dropdown } from '../../ui/Dropdown';
import { useAuth } from '../../../contexts/AuthContext';

interface CarrierRegisterScreenProps {
  onNavigate: (screen: string, params?: any) => void;
  initialData?: any;
}

// Validation helpers
const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
// Tunisian phone: 8 digits, optionally prefixed by +216 (with optional space/dash)
const isValidPhone = (val: string) => /^(\+216[\s-]?)?\d{8}$/.test(val.replace(/\s/g, ''));
// Strong password: min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
const isStrongPassword = (val: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(val);
// Matricule fiscale: exactly 7 digits then 1 letter
const isValidMatricule = (val: string) => /^\d{7}[A-Za-z]$/.test(val.trim());
// Immatriculation tunisienne: 1-3 digits, optional space, TN, optional space, 1-4 digits
const isValidLicense = (val: string) => /^\d{1,3}\s?TN\s?\d{1,4}$/.test(val.trim());

export const CarrierRegisterScreen: React.FC<CarrierRegisterScreenProps> = ({ onNavigate, initialData }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gouvernerat, setGouvernerat] = useState('');
  const [license, setLicense] = useState('');
  const [matricule, setMatricule] = useState('');
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
      if (fd.gouvernerat !== undefined) setGouvernerat(fd.gouvernerat);
      if (fd.license !== undefined) setLicense(fd.license);
      if (fd.matricule !== undefined) setMatricule(fd.matricule);
      if (fd.password !== undefined) setPassword(fd.password);
      if (fd.confirmPassword !== undefined) setConfirmPassword(fd.confirmPassword);
      if (fd.acceptedTerms !== undefined) setAcceptedTerms(fd.acceptedTerms);
    }
  }, []);

  const currentFormData = () => ({
    firstName, lastName, phone, email, gouvernerat,
    license, matricule, password, confirmPassword, acceptedTerms,
  });

  const gouverneratOptions = [
    { label: 'Ariana', value: 'ariana' },
    { label: 'Béja', value: 'beja' },
    { label: 'Ben Arous', value: 'ben_arous' },
    { label: 'Bizerte', value: 'bizerte' },
    { label: 'Gabès', value: 'gabes' },
    { label: 'Gafsa', value: 'gafsa' },
    { label: 'Jendouba', value: 'jendouba' },
    { label: 'Kairouan', value: 'kairouan' },
    { label: 'Kasserine', value: 'kasserine' },
    { label: 'Kébili', value: 'kebili' },
    { label: 'La Manouba', value: 'manouba' },
    { label: 'Le Kef', value: 'kef' },
    { label: 'Mahdia', value: 'mahdia' },
    { label: 'Médenine', value: 'medenine' },
    { label: 'Monastir', value: 'monastir' },
    { label: 'Nabeul', value: 'nabeul' },
    { label: 'Sfax', value: 'sfax' },
    { label: 'Sidi Bouzid', value: 'sidi_bouzid' },
    { label: 'Siliana', value: 'siliana' },
    { label: 'Sousse', value: 'sousse' },
    { label: 'Tataouine', value: 'tataouine' },
    { label: 'Tozeur', value: 'tozeur' },
    { label: 'Tunis', value: 'tunis' },
    { label: 'Zaghouan', value: 'zaghouan' },
  ];

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

    if (!gouvernerat) errors.gouvernerat = 'Le gouvernorat est obligatoire';

    if (!license.trim()) {
      errors.license = "L'immatriculation est obligatoire";
    } else if (!isValidLicense(license)) {
      errors.license = 'Format invalide — ex: 123 TN 4567';
    }

    if (!matricule.trim()) {
      errors.matricule = 'La matricule fiscale est obligatoire';
    } else if (!isValidMatricule(matricule)) {
      errors.matricule = 'Format invalide — 7 chiffres + 1 lettre (ex: 1234567A)';
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
        role: 'carrier',
        gouvernerat,
        license: license.trim(),
        matricule: matricule.trim(),
      });

      if (result.success) {
        // Navigate to onboarding flow instead of dashboard
        onNavigate('carrierOnboarding2');
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
          <Text style={styles.subtitle}>Compte Transporteur</Text>
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
                placeholder="Flen"
                value={firstName}
                onChangeText={(v) => { setFirstName(v); setFieldErrors(e => ({ ...e, firstName: '' })); }}
                icon={<Text>👤</Text>}
              />
              {fieldErrors.firstName ? <Text style={styles.fieldError}>{fieldErrors.firstName}</Text> : null}
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Nom"
                placeholder="Ben Foulen"
                value={lastName}
                onChangeText={(v) => { setLastName(v); setFieldErrors(e => ({ ...e, lastName: '' })); }}
              />
              {fieldErrors.lastName ? <Text style={styles.fieldError}>{fieldErrors.lastName}</Text> : null}
            </View>
          </View>

          <Input
            label="Téléphone"
            placeholder="+216 20 123 456"
            value={phone}
            onChangeText={(v) => { setPhone(v); setFieldErrors(e => ({ ...e, phone: '' })); }}
            keyboardType="phone-pad"
            icon={<Text>📱</Text>}
          />
          {fieldErrors.phone ? <Text style={styles.fieldError}>{fieldErrors.phone}</Text> : null}

          <Input
            label="Email"
            placeholder="Flen.BenFoulen@gmail.com"
            value={email}
            onChangeText={(v) => { setEmail(v); setFieldErrors(e => ({ ...e, email: '' })); }}
            keyboardType="email-address"
            icon={<Text>✉️</Text>}
          />
          {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}

          <Dropdown
            label="Gouvernorat"
            placeholder="Sélectionner votre gouvernorat"
            value={gouvernerat}
            onValueChange={(v) => { setGouvernerat(v); setFieldErrors(e => ({ ...e, gouvernerat: '' })); }}
            options={gouverneratOptions}
            icon={<Text>📍</Text>}
          />
          {fieldErrors.gouvernerat ? <Text style={styles.fieldError}>{fieldErrors.gouvernerat}</Text> : null}

          <Input
            label="Immatriculation du véhicule"
            placeholder="123 TN 4567"
            value={license}
            onChangeText={(v) => { setLicense(v); setFieldErrors(e => ({ ...e, license: '' })); }}
            keyboardType="default"
            maxLength={12}
            icon={<Text>🚗</Text>}
          />
          {fieldErrors.license ? <Text style={styles.fieldError}>{fieldErrors.license}</Text> : null}

          <Input
            label="Matricule Fiscale"
            placeholder="1234567A"
            value={matricule}
            onChangeText={(v) => { setMatricule(v); setFieldErrors(e => ({ ...e, matricule: '' })); }}
            keyboardType="default"
            maxLength={8}
            icon={<Text>🏢</Text>}
          />
          {fieldErrors.matricule ? <Text style={styles.fieldError}>{fieldErrors.matricule}</Text> : null}

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
            <TouchableOpacity onPress={() => onNavigate('termsAndConditionsCarrier', { returnScreen: 'carrierRegister', formData: currentFormData() })}>
              <Text style={styles.link}>Conditions générales</Text>
            </TouchableOpacity>
            <Text style={styles.checkboxLabel}>{' '}et la{' '}</Text>
            <TouchableOpacity onPress={() => onNavigate('privacySecurityCarrier', { returnScreen: 'carrierRegister', formData: currentFormData() })}>
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
  fieldError: {
    color: '#D92D20',
    fontSize: 12,
    marginTop: -8,
    marginLeft: 2,
  },
});
