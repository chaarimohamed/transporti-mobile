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
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import * as authService from '../../../services/authService';
import { openAndroidDatePicker } from '../../../utils/androidDatePicker';

interface PersonalInformationScreenProps {
  onNavigate?: (screen: string, params?: unknown) => void;
}

interface PersonalInformationFormUser {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  phone?: string;
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

  const populateForm = (u: PersonalInformationFormUser) => {
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
      populateForm(user);
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

  const handleOpenDatePicker = () => {
    if (Platform.OS === 'android') {
      openAndroidDatePicker({
        value: selectedDate,
        minimumDate: new Date(1920, 0, 1),
        maximumDate: new Date(),
        onConfirm: (date) => {
          setSelectedDate(date);
          setDateOfBirth(formatDateToString(date));
        },
      });
      return;
    }

    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('profile')}
        >
          <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
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
                <AppIcon name="profile-user" size={40} color={Colors.textMuted} />
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
              onPress={handleOpenDatePicker}
              activeOpacity={0.7}
            >
              <Text style={dateOfBirth ? styles.dateButtonText : styles.dateButtonPlaceholder}>
                {dateOfBirth || 'JJ/MM/AAAA'}
              </Text>
              <AppIcon name="date-field" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                minimumDate={new Date(1920, 0, 1)}
                onChange={(_, date) => {
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 72,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
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
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  photoContainer: {
    marginRight: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  photoTextContainer: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  photoDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  changePhotoLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  form: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm + 4,
  },
  halfInput: {
    flex: 1,
    flexBasis: 150,
  },
  phoneContainer: {
    marginTop: Spacing.sm,
  },
  phoneLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  countryCode: {
    width: 80,
    height: 56,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  phoneInput: {
    flex: 1,
    minWidth: 0,
  },
  changeNumberLink: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginTop: Spacing.sm,
    textAlign: 'right',
  },
  dateLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 18,
  },
  dateButtonText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginRight: Spacing.sm + 4,
  },
  dateButtonPlaceholder: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.placeholder,
    marginRight: Spacing.sm + 4,
  },
  dateConfirmButton: {
    marginTop: Spacing.sm,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
  dateConfirmText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primary,
  },
  buttonContainer: {
    marginTop: 32,
  },
});

export default PersonalInformationScreen;
