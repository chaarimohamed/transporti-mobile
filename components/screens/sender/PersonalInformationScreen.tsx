import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

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
          onPress={() => onNavigate?.('profile')}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal information</Text>
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
              With a photo of yourself, you can personalise your profile and build greater trust with other members!
            </Text>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={styles.changePhotoLink}>Change your photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* First Name and Last Name */}
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="First name"
                placeholder="Ahmed"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfInput}>
              <Input
                label="Last name"
                placeholder="Louati"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          {/* Date of Birth */}
          <Input
            label="Date of birth"
            placeholder="DD/MM/YYYY"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            keyboardType="numeric"
          />

          {/* Email */}
          <Input
            label="Email"
            placeholder="ahmed.louati.999@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {/* Phone Number */}
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>Phone number</Text>
            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>DE 🇩🇪</Text>
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
            <TouchableOpacity>
              <Text style={styles.changeNumberLink}>Change my number</Text>
            </TouchableOpacity>
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
            {isLoading ? 'Saving...' : 'Save changes'}
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
  buttonContainer: {
    marginTop: 32,
  },
});

export default PersonalInformationScreen;
