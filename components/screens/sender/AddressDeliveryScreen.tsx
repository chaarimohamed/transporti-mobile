import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import * as Location from 'expo-location';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Dropdown } from '../../ui/Dropdown';
import { AddressAutocomplete } from '../../ui/AddressAutocomplete';
import { AddressDetails } from '../../../services/googlePlaces.service';

interface AddressDeliveryScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  initialData?: any;
}

const AddressDeliveryScreen: React.FC<AddressDeliveryScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCoordinates, setDeliveryCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [deliveryHelperCount, setDeliveryHelperCount] = useState(0);
  const [isNotRecipient, setIsNotRecipient] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [instructions, setInstructions] = useState('');

  // Populate state from initialData (when returning from MapPicker or navigating back)
  useEffect(() => {
    if (initialData?.deliveryAddress) {
      setDeliveryAddress(initialData.deliveryAddress);
    }
    if (initialData?.deliveryCoordinates) {
      setDeliveryCoordinates(initialData.deliveryCoordinates);
    }
    if (initialData?.deliveryHelperCount !== undefined) {
      setDeliveryHelperCount(initialData.deliveryHelperCount);
    }
    if (initialData?.isNotRecipient !== undefined) {
      setIsNotRecipient(initialData.isNotRecipient);
    }
    if (initialData?.recipientName) {
      setRecipientName(initialData.recipientName);
    }
    if (initialData?.recipientPhone) {
      setRecipientPhone(initialData.recipientPhone);
    }
    if (initialData?.deliveryInstructions) {
      setInstructions(initialData.deliveryInstructions);
    }
  }, [initialData]);

  const handleNext = () => {
    const data = {
      ...initialData,
      deliveryAddress,
      deliveryCoordinates,
      deliveryHelperCount,
      isNotRecipient,
      recipientName,
      recipientPhone,
      deliveryInstructions: instructions,
    };
    onNavigate?.('createShipmentStep2', data);
  };

  const handleSelectAddress = (address: AddressDetails) => {
    setDeliveryCoordinates({
      lat: address.latitude,
      lng: address.longitude,
    });
  };

  const handleGetCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "L'accès à la localisation est requis");
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (place) {
        const parts = [place.streetNumber, place.street, place.city, place.region].filter(Boolean);
        const address = parts.join(', ');
        setDeliveryAddress(address);
        setDeliveryCoordinates({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } else {
        Alert.alert('Erreur', 'Impossible de déterminer votre adresse');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    }
  };

  const isFormValid = deliveryAddress && (!isNotRecipient || (recipientName && recipientPhone));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('addressPickup', {
            ...initialData,
            deliveryAddress,
            deliveryCoordinates,
            deliveryHelperCount,
            isNotRecipient,
            recipientName,
            recipientPhone,
            deliveryInstructions: instructions,
          })}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Définir le trajet</Text>
      </View>

      {/* Address Input */}
      <View style={styles.addressSection}>
        <Text style={styles.addressLabel}>Adresse de livraison</Text>
        <View style={styles.addressInputContainer}>
          <View style={styles.dotIndicator} />
          <View style={styles.inputWrapper}>
            <AddressAutocomplete
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              onSelectAddress={handleSelectAddress}
              placeholder="Rechercher une adresse de livraison"
              iconText=""
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* GPS Current Location */}
        <TouchableOpacity
          style={styles.locationButton}
          activeOpacity={0.7}
          onPress={handleGetCurrentLocation}
        >
          <View style={styles.locationIcon}>
            <AppIcon name="map-current-location" size={20} color={Colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Ma position actuelle</Text>
            <Text style={styles.locationSubtitle}>Remplir automatiquement via GPS</Text>
          </View>
        </TouchableOpacity>

        {/* Map Picker */}
        <TouchableOpacity
          style={styles.locationButton}
          activeOpacity={0.7}
          onPress={() => onNavigate?.('mapPicker', {
            ...initialData, type: 'delivery',
            deliveryAddress, deliveryCoordinates, deliveryHelperCount, isNotRecipient, recipientName, recipientPhone, deliveryInstructions: instructions,
          })}
        >
          <View style={styles.locationIcon}>
            <AppIcon name="map-picker" size={20} color={Colors.primary} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Utiliser la carte</Text>
            <Text style={styles.locationSubtitle}>Choisir sur la carte interactive</Text>
          </View>
        </TouchableOpacity>

        {/* Helper */}
        <View style={styles.section}>
          <Dropdown
            label="Besoin d'aide ?"
            value={String(deliveryHelperCount)}
            onValueChange={(val) => setDeliveryHelperCount(parseInt(val))}
            options={[
              { label: 'Non', value: '0' },
              { label: '1 personne (+15 DT)', value: '1' },
              { label: '2 personnes (+30 DT)', value: '2' },
            ]}
          />
        </View>

        {/* Not Recipient Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>J'ai les coordonnées du destinataire</Text>
            <TouchableOpacity
              style={[styles.toggle, isNotRecipient && styles.toggleActive]}
              onPress={() => setIsNotRecipient(!isNotRecipient)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.toggleThumb,
                  isNotRecipient && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>

          {isNotRecipient && (
            <View style={styles.recipientInfo}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom et prénom</Text>
                <View style={styles.inputWithIcon}>
                  <AppIcon name="profile-user" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: Ahmed Ben Salah"
                    placeholderTextColor={Colors.placeholder}
                    value={recipientName}
                    onChangeText={setRecipientName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de téléphone</Text>
                <View style={styles.inputWithIcon}>
                  <AppIcon name="phone" size={18} color={Colors.textMuted} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: +216 20 123 456"
                    placeholderTextColor={Colors.placeholder}
                    value={recipientPhone}
                    onChangeText={setRecipientPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Instructions supplémentaires</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Code porte, étage, etc."
                  placeholderTextColor="#999"
                  value={instructions}
                  onChangeText={setInstructions}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomActions}>
        <Button
          onPress={handleNext}
          style={[styles.nextButton, !isFormValid && styles.nextButtonDisabled]}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>Continuer</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 36,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  addressSection: {
    paddingHorizontal: Spacing.md,
    paddingTop: 10,
    paddingBottom: Spacing.sm + 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  addressLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  addressInput: {
    height: 44,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  clearIcon: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  locationSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm + 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm + 4,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: Spacing.sm,
    gap: Spacing.sm + 4,
  },
  optionButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  optionText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionSubtext: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  toggleLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  recipientInfo: {
    marginTop: Spacing.md,
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginLeft: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm + 4,
  },
  textInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 100,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  nextButton: {
    width: '100%',
    minHeight: 54,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontFamily: Fonts.semiBold,
    color: Colors.textInverse,
    fontSize: FontSizes.base,
  },
});

export default AddressDeliveryScreen;
