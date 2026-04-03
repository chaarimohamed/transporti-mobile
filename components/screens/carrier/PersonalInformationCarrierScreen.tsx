import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Dropdown } from '../../ui/Dropdown';
import { useAuth } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';

interface PersonalInformationCarrierScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const PersonalInformationCarrierScreen: React.FC<PersonalInformationCarrierScreenProps> = ({
  onNavigate,
}) => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gouvernorat, setGouvernorat] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseDateString = (str: string): Date => {
    if (!str) return new Date(2000, 0, 1);
    const parts = str.split('/');
    if (parts.length !== 3) return new Date(2000, 0, 1);
    const [day, month, year] = parts.map(Number);
    const d = new Date(year, month - 1, day);
    return isNaN(d.getTime()) ? new Date(2000, 0, 1) : d;
  };

  const formatDateToString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const populateForm = (u: any) => {
    setFirstName(u.firstName || '');
    setLastName(u.lastName || '');
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setGouvernorat(u.gouvernerat || '');
    setVehicleType(u.vehicleType || '');
    if (u.dateOfBirth) {
      setDateOfBirth(u.dateOfBirth);
      setSelectedDate(parseDateString(u.dateOfBirth));
    }
  };

  useEffect(() => {
    // Populate from cached user immediately, then refresh from server
    if (user) populateForm(user);
    authService.getMe().then((result) => {
      if (result.success && result.user) {
        populateForm(result.user);
        if (updateUser) updateUser(result.user);
      }
    });
  }, []);

  const gouvernoratOptions = [
    { label: 'Tunis', value: 'TUNIS' },
    { label: 'Ariana', value: 'ARIANA' },
    { label: 'Ben Arous', value: 'BEN_AROUS' },
    { label: 'Manouba', value: 'MANOUBA' },
    { label: 'Nabeul', value: 'NABEUL' },
    { label: 'Zaghouan', value: 'ZAGHOUAN' },
    { label: 'Bizerte', value: 'BIZERTE' },
    { label: 'Béja', value: 'BEJA' },
    { label: 'Jendouba', value: 'JENDOUBA' },
    { label: 'Le Kef', value: 'LE_KEF' },
    { label: 'Siliana', value: 'SILIANA' },
    { label: 'Sousse', value: 'SOUSSE' },
    { label: 'Monastir', value: 'MONASTIR' },
    { label: 'Mahdia', value: 'MAHDIA' },
    { label: 'Sfax', value: 'SFAX' },
    { label: 'Kairouan', value: 'KAIROUAN' },
    { label: 'Kasserine', value: 'KASSERINE' },
    { label: 'Sidi Bouzid', value: 'SIDI_BOUZID' },
    { label: 'Gabès', value: 'GABES' },
    { label: 'Médenine', value: 'MEDENINE' },
    { label: 'Tataouine', value: 'TATAOUINE' },
    { label: 'Gafsa', value: 'GAFSA' },
    { label: 'Tozeur', value: 'TOZEUR' },
    { label: 'Kébili', value: 'KEBILI' },
  ];

  const vehicleTypeOptions = [
    { label: 'Camionnette', value: 'VAN' },
    { label: 'Camion', value: 'TRUCK' },
    { label: 'Semi-remorque', value: 'SEMI_TRAILER' },
    { label: 'Fourgon', value: 'DELIVERY_VAN' },
  ];

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await authService.updateProfile({
        firstName,
        lastName,
        email,
        phone,
        ...(dateOfBirth && { dateOfBirth }),
        // BUG-05 fix: send carrier-specific fields so the backend persists them
        ...(gouvernorat && { gouvernorat }),
        ...(vehicleType && { vehicleType }),
      });
      
      if (result.success && result.user) {
        // Update the auth context with new user data
        if (updateUser) {
          updateUser(result.user);
        }
        Alert.alert('Succès', 'Vos informations ont été mises à jour', [
          { text: 'OK', onPress: () => onNavigate?.('profileCarrier') },
        ]);
      } else {
        Alert.alert('Erreur', result.error || 'Impossible de mettre à jour les informations');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Changer la photo',
      'Choisissez une option',
      [
        { text: 'Prendre une photo', onPress: () => {} },
        { text: 'Choisir dans la galerie', onPress: () => {} },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('profileCarrier')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Informations personnelles</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Photo Section */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
          </View>
          <View style={styles.photoTextContainer}>
            <Text style={styles.photoDescription}>
              Avec une photo de vous, personnalisez votre profil et renforcez la confiance avec vos clients !
            </Text>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={styles.changePhotoLink}>Changer votre photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* First Name and Last Name */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="Prénom"
                placeholder="Sami"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Nom"
                placeholder="Ben Ali"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <View>
            <Text style={styles.dateLabel}>Date de naissance</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={dateOfBirth ? styles.dateButtonText : styles.dateButtonPlaceholder}>
                {dateOfBirth || 'JJ/MM/AAAA'}
              </Text>
              <Text style={styles.dateIcon}>📅</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={(_, date) => {
                  if (Platform.OS === 'android') setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    setDateOfBirth(formatDateToString(date));
                  }
                }}
              />
            )}
            {showDatePicker && Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.dateConfirmButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.dateConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Email */}
          <Input
            label="Email"
            placeholder="sami.benali@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number */}
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>Numéro de téléphone</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>TN 🇹🇳</Text>
              </View>
              <View style={styles.phoneInput}>
                <Input
                  placeholder="22 123 456"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeNumberLink}>Changer mon numéro</Text>
            </TouchableOpacity>
          </View>

          {/* Gouvernorat */}
          <Dropdown
            label="Gouvernorat"
            placeholder="Sélectionnez votre gouvernorat"
            value={gouvernorat}
            onValueChange={setGouvernorat}
            options={gouvernoratOptions}
          />

          {/* Vehicle Type */}
          <Dropdown
            label="Type de véhicule"
            placeholder="Sélectionnez votre type de véhicule"
            value={vehicleType}
            onValueChange={setVehicleType}
            options={vehicleTypeOptions}
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSaveChanges}
            size="lg"
            fullWidth
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  photoSection: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  photoContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9E9E9',
  },
  avatarIcon: {
    fontSize: 40,
    opacity: 0.5,
  },
  photoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  photoDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 8,
  },
  changePhotoLink: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '600',
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
  phoneContainer: {
    marginTop: 8,
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCode: {
    width: 80,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  phoneInput: {
    flex: 1,
  },
  changeNumberLink: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'right',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  dateButtonText: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  dateButtonPlaceholder: {
    fontSize: 15,
    color: '#AAAAAA',
  },
  dateIcon: {
    fontSize: 18,
  },
  dateConfirmButton: {
    marginTop: 8,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  dateConfirmText: {
    fontSize: 14,
    color: '#1464F6',
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default PersonalInformationCarrierScreen;
