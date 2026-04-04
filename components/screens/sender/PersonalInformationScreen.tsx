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
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';

interface PersonalInformationScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const PersonalInformationScreen: React.FC<PersonalInformationScreenProps> = ({
  onNavigate,
}) => {
  const { user, updateUser } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [phone, setPhone] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
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
    setPhone(u.phone || '');
    if (u.dateOfBirth) {
      setDateOfBirth(u.dateOfBirth);
      setSelectedDate(parseDateString(u.dateOfBirth));
    }
  };

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setDateOfBirth(user.dateOfBirth || '');
      setPhone(user.phone || '');
    }
    // Load stored profile photo
    authService.getProfilePhoto().then((res) => {
      if (res.success && res.photoBase64) {
        setPhotoUri(`data:image/jpeg;base64,${res.photoBase64}`);
      }
    });
  }, [user]);

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsLoading(true);
      
      const result = await authService.updateProfile({
        firstName,
        lastName,
        phone,
        ...(dateOfBirth && { dateOfBirth }),
      });
      
      if (result.success && result.user) {
        // Update the auth context with new user data
        if (updateUser) {
          updateUser(result.user);
        }
        Alert.alert('Succès', 'Vos informations ont été mises à jour', [
          { text: 'OK', onPress: () => onNavigate?.('profile') },
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

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à la caméra est requis");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);
      if (asset.base64) {
        authService.uploadProfilePhoto(asset.base64).catch((e) =>
          console.error('Photo upload failed:', e)
        );
      }
    }
  };

  const handlePickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à la galerie est requis");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setPhotoUri(asset.uri);
      if (asset.base64) {
        authService.uploadProfilePhoto(asset.base64).catch((e) =>
          console.error('Photo upload failed:', e)
        );
      }
    }
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Changer la photo',
      'Choisissez une option',
      [
        { text: 'Prendre une photo', onPress: handleTakePhoto },
        { text: 'Choisir dans la galerie', onPress: handlePickFromGallery },
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
          onPress={() => onNavigate?.('profile')}
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
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.avatarIcon}>👤</Text>
              )}
            </View>
          </View>
          <View style={styles.photoTextContainer}>
            <Text style={styles.photoDescription}>
              Avec une photo de vous, personnalisez votre profil et renforcez la confiance avec les autres membres !
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
                placeholder="Ahmed"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Nom"
                placeholder="Louati"
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

          {/* Phone Number */}
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>Numéro de téléphone</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>TN 🇹🇳</Text>
              </View>
              <View style={styles.phoneInput}>
                <Input
                  placeholder="01551 0636586"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

          </View>
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
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

export default PersonalInformationScreen;
