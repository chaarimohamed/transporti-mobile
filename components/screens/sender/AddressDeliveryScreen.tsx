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
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
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
  const [meetingPoint, setMeetingPoint] = useState('vehicle');
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
    if (initialData?.deliveryMeetingPoint) {
      setMeetingPoint(initialData.deliveryMeetingPoint);
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
      deliveryMeetingPoint: meetingPoint,
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
            deliveryMeetingPoint: meetingPoint,
            isNotRecipient,
            recipientName,
            recipientPhone,
            deliveryInstructions: instructions,
          })}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Définir le trajet</Text>
      </View>

      {/* Address Input */}
      <View style={styles.addressSection}>
        <View style={styles.addressInputContainer}>
          <View style={styles.dotIndicator} />
          <View style={styles.inputWrapper}>
            <AddressAutocomplete
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              onSelectAddress={handleSelectAddress}
              placeholder="Adresse de livraison"
              iconText=""
            />
          </View>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Current Location */}
        <TouchableOpacity 
          style={styles.locationButton} 
          activeOpacity={0.7}
          onPress={() => onNavigate?.('mapPicker', { ...initialData, type: 'delivery' })}
        >
          <View style={styles.locationIcon}>
            <Text style={styles.locationIconText}>📍</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationTitle}>Ma position actuelle</Text>
            <Text style={styles.locationSubtitle}>Utiliser le GPS</Text>
          </View>
        </TouchableOpacity>

        {/* Meeting Point */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Où on se rencontre?</Text>
          
          <TouchableOpacity
            style={[
              styles.optionButton,
              meetingPoint === 'vehicle' && styles.optionButtonActive,
            ]}
            onPress={() => setMeetingPoint('vehicle')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioOuter,
                meetingPoint === 'vehicle' && styles.radioOuterActive,
              ]}
            >
              {meetingPoint === 'vehicle' && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.optionText}>Près du véhicule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              meetingPoint === 'home' && styles.optionButtonActive,
            ]}
            onPress={() => setMeetingPoint('home')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.radioOuter,
                meetingPoint === 'home' && styles.radioOuterActive,
              ]}
            >
              {meetingPoint === 'home' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>Chez le destinataire</Text>
              <Text style={styles.optionSubtext}>Frais 15DT</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Not Recipient Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Vous n'êtes pas le destinataire?</Text>
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
                  <Text style={styles.inputIconText}>👤</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: Ahmed Ben Salah"
                    placeholderTextColor="#999"
                    value={recipientName}
                    onChangeText={setRecipientName}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Numéro de téléphone</Text>
                <View style={styles.inputWithIcon}>
                  <Text style={styles.inputIconText}>📞</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ex: +216 20 123 456"
                    placeholderTextColor="#999"
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    gap: 16,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  addressSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1464F6',
    marginTop: 4,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  addressInput: {
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1464F6',
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1A1A1A',
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  clearIcon: {
    fontSize: 16,
    color: '#666',
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
    padding: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1464F6' + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationIconText: {
    fontSize: 20,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    gap: 12,
  },
  optionButtonActive: {
    borderColor: '#1464F6',
    backgroundColor: '#1464F6' + '0D',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#1464F6',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1464F6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionSubtext: {
    fontSize: 12,
    color: '#666',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E9E9E9',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#1464F6',
  },
  toggleThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  recipientInfo: {
    marginTop: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 4,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    paddingHorizontal: 16,
    gap: 12,
  },
  inputIconText: {
    fontSize: 18,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  textArea: {
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    padding: 16,
    fontSize: 15,
    color: '#1A1A1A',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddressDeliveryScreen;
