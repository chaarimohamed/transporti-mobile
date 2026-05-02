import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { Colors } from '../../../theme';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Dropdown } from '../../ui/Dropdown';
import { AppIcon } from '../../ui/Icon';
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

const parseLicenseValue = (val: string) => {
  const match = val.trim().match(/^(\d{1,3})\s*(?:TN|تونس)\s*(\d{1,4})$/i);
  return {
    front: match?.[1] ?? '',
    back: match?.[2] ?? '',
  };
};

const buildLicenseValue = (front: string, back: string) => {
  const normalizedFront = front.trim();
  const normalizedBack = back.trim();

  if (!normalizedFront && !normalizedBack) {
    return '';
  }

  if (!normalizedFront) {
    return `TN ${normalizedBack}`;
  }

  if (!normalizedBack) {
    return `${normalizedFront} TN`;
  }

  return `${normalizedFront} TN ${normalizedBack}`;
};

export const CarrierRegisterScreen: React.FC<CarrierRegisterScreenProps> = ({ onNavigate, initialData }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gouvernerat, setGouvernerat] = useState('');
  const [licenseFront, setLicenseFront] = useState('');
  const [licenseBack, setLicenseBack] = useState('');
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
      if (fd.license !== undefined) {
        const parsedLicense = parseLicenseValue(fd.license);
        setLicenseFront(parsedLicense.front);
        setLicenseBack(parsedLicense.back);
      }
      if (fd.matricule !== undefined) setMatricule(fd.matricule);
      if (fd.password !== undefined) setPassword(fd.password);
      if (fd.confirmPassword !== undefined) setConfirmPassword(fd.confirmPassword);
      if (fd.acceptedTerms !== undefined) setAcceptedTerms(fd.acceptedTerms);
    }
  }, []);

  const currentFormData = () => ({
    firstName, lastName, phone, email, gouvernerat,
    license: buildLicenseValue(licenseFront, licenseBack), matricule, password, confirmPassword, acceptedTerms,
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
    const license = buildLicenseValue(licenseFront, licenseBack);

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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => onNavigate('roleSelection')} style={styles.backButton}>
            <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
          </TouchableOpacity>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Compte Transporteur</Text>
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
                placeholder="Flen"
                value={firstName}
                onChangeText={(v) => { setFirstName(v); setFieldErrors(e => ({ ...e, firstName: '' })); }}
                icon={<AppIcon name="profile-user" size={18} color={Colors.textMuted} />}
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
            icon={<AppIcon name="phone" size={18} color={Colors.textMuted} />}
          />
          {fieldErrors.phone ? <Text style={styles.fieldError}>{fieldErrors.phone}</Text> : null}

          <Input
            label="Email"
            placeholder="Flen.BenFoulen@gmail.com"
            value={email}
            onChangeText={(v) => { setEmail(v); setFieldErrors(e => ({ ...e, email: '' })); }}
            keyboardType="email-address"
            icon={<AppIcon name="email" size={18} color={Colors.textMuted} />}
          />
          {fieldErrors.email ? <Text style={styles.fieldError}>{fieldErrors.email}</Text> : null}

          <Dropdown
            label="Gouvernorat"
            placeholder="Sélectionner votre gouvernorat"
            value={gouvernerat}
            onValueChange={(v) => { setGouvernerat(v); setFieldErrors(e => ({ ...e, gouvernerat: '' })); }}
            options={gouverneratOptions}
            icon={<AppIcon name="location-pin" size={18} color={Colors.textMuted} />}
          />
          {fieldErrors.gouvernerat ? <Text style={styles.fieldError}>{fieldErrors.gouvernerat}</Text> : null}

          <View>
            <Text style={styles.licenseLabel}>Immatriculation du véhicule</Text>
            <View style={[styles.licenseRow, fieldErrors.license ? styles.licenseRowError : null]}>
              <View style={styles.licenseIconWrap}>
                <AppIcon name="truck" size={18} color={Colors.textMuted} />
              </View>
              <TextInput
                style={styles.licenseInput}
                placeholder="123"
                placeholderTextColor={Colors.placeholder}
                value={licenseFront}
                onChangeText={(value) => {
                  setLicenseFront(value.replace(/\D/g, '').slice(0, 3));
                  setFieldErrors((prev) => ({ ...prev, license: '' }));
                }}
                keyboardType="numeric"
                maxLength={3}
              />
              <View style={styles.licenseChip}>
                <Text style={styles.licenseChipText}>تونس</Text>
              </View>
              <TextInput
                style={styles.licenseInput}
                placeholder="4567"
                placeholderTextColor={Colors.placeholder}
                value={licenseBack}
                onChangeText={(value) => {
                  setLicenseBack(value.replace(/\D/g, '').slice(0, 4));
                  setFieldErrors((prev) => ({ ...prev, license: '' }));
                }}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <Text style={styles.licenseHint}>Saisissez 3 chiffres puis 4 chiffres séparés par la mention fixe تونس.</Text>
          </View>
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
    paddingTop: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: -6,
  },
  header: {
    marginBottom: 24,
  },
  licenseLabel: {
    color: '#3E4957',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  licenseRow: {
    alignItems: 'center',
    backgroundColor: '#F7F3EC',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  licenseRowError: {
    borderColor: Colors.error,
  },
  licenseIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  licenseInput: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    color: '#3E4957',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    minHeight: 44,
    paddingHorizontal: 12,
    textAlign: 'center',
  },
  licenseChip: {
    alignItems: 'center',
    backgroundColor: Colors.primarySurface,
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  licenseChipText: {
    color: Colors.primaryDark,
    fontSize: 15,
    fontWeight: '700',
  },
  licenseHint: {
    color: '#666',
    fontSize: 12,
    marginLeft: 2,
    marginTop: 8,
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
  required: {
    color: Colors.error,
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
  fieldError: {
    color: Colors.error,
    fontSize: 12,
    marginTop: -8,
    marginLeft: 2,
  },
});
