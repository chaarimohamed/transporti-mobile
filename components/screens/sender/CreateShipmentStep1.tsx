import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Button } from '../../ui/Button';
import { AppIcon } from '../../ui/Icon';
import { openAndroidDatePicker } from '../../../utils/androidDatePicker';

interface ShipmentStep1Data {
  photos?: { uri: string; base64: string }[];
  pickupDate?: string;
  weightRange?: string;
}

interface CreateShipmentStep1Props {
  onNavigate?: (screen: string, data?: ShipmentStep1Data) => void;
  initialData?: ShipmentStep1Data;
}

const CreateShipmentStep1: React.FC<CreateShipmentStep1Props> = ({
  onNavigate,
  initialData,
}) => {
  const [photos, setPhotos] = useState<{ uri: string; base64: string }[]>([]);
  const [pickupDate, setPickupDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [weightRange, setWeightRange] = useState('');
  const [showWeightPicker, setShowWeightPicker] = useState(false);

  // Restore state from initialData when navigating back
  useEffect(() => {
    if (initialData?.photos) {
      setPhotos(initialData.photos);
    }
    if (initialData?.pickupDate) {
      // Parse date from DD/MM/YYYY format
      const parts = initialData.pickupDate.split('/');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        setPickupDate(date);
      }
    }
    if (initialData?.weightRange) {
      setWeightRange(initialData.weightRange);
    }
  }, [initialData]);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
  };

  const handleOpenDatePicker = () => {
    if (Platform.OS === 'android') {
      openAndroidDatePicker({
        value: pickupDate,
        minimumDate: new Date(),
        onConfirm: setPickupDate,
      });
      return;
    }

    setShowDatePicker(true);
  };

  const handleAddPhoto = async () => {
    // Request permission to access photos
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Permission requise',
        'Transporti a besoin d\'accéder à vos photos pour télécharger des images.'
      );
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.3,
      aspect: [4, 3],
      base64: true,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets
        .filter(asset => asset.base64)
        .map(asset => ({ uri: asset.uri, base64: asset.base64! }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    const data = {
      photos,
      pickupDate: formatDate(pickupDate),
      weightRange,
    };
    onNavigate?.('addressPickup', data);
  };

  const isFormValid = weightRange;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('dashboard')}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={22} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Nouvelle expédition</Text>
          <Text style={styles.stepIndicator}>1/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33.33%' }]} />
        </View>
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>Ajouter des photos</Text>
          <View style={styles.photosContainer}>
            <TouchableOpacity
              style={styles.addPhotoButton}
              onPress={handleAddPhoto}
              activeOpacity={0.7}
            >
              <AppIcon name="add-photo" size={28} color={Colors.primary} />
            </TouchableOpacity>

            {photos.map((photo, index) => (
              <View key={index} style={styles.photoPreview}>
                <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                  activeOpacity={0.7}
                >
                  <AppIcon name="close" size={10} color={Colors.textInverse} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Pickup Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Date de collecte</Text>
          <TouchableOpacity
            style={styles.pickerInputContainer}
            onPress={handleOpenDatePicker}
          >
            <AppIcon name="date-field" size={18} color={Colors.textMuted} />
            <Text style={styles.pickerText}>
              {formatDate(pickupDate)}
            </Text>
            <AppIcon name="caret-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && Platform.OS === 'ios' && (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
            >
              <View style={styles.pickerModal}>
                <View style={styles.pickerHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.pickerCancelButton}>Annuler</Text>
                  </TouchableOpacity>
                  <Text style={styles.pickerTitle}>Date de collecte</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.pickerDoneButton}>Terminé</Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  value={pickupDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  style={styles.picker}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        {/* Weight Range */}
        <View style={styles.section}>
          <Text style={styles.label}>Poids estimé (kg)</Text>
          <TouchableOpacity
            style={styles.pickerInputContainer}
            onPress={() => setShowWeightPicker(true)}
          >
            <AppIcon name="weight" size={18} color={Colors.textMuted} />
            <Text style={[styles.pickerText, !weightRange && styles.pickerPlaceholder]}>
              {weightRange || 'Sélectionner le poids'}
            </Text>
            <AppIcon name="caret-down" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Weight Picker Modal */}
        <Modal
          visible={showWeightPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowWeightPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowWeightPicker(false)}
          >
            <TouchableOpacity 
              style={styles.pickerModal}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                  <Text style={styles.pickerCancelButton}>Annuler</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Poids estimé</Text>
                <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                  <Text style={styles.pickerDoneButton}>Terminé</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={weightRange}
                onValueChange={(itemValue) => setWeightRange(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Sélectionner le poids" value="" />
                <Picker.Item label="Moins de 5 kg" value="<5" />
                <Picker.Item label="Entre 5 kg et 30 kg" value="5-30" />
                <Picker.Item label="Entre 30 kg et 50 kg" value="30-50" />
                <Picker.Item label="Entre 50 kg et 100 kg" value="50-100" />
                <Picker.Item label="Plus de 100 kg" value=">100" />
              </Picker>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          onPress={() => onNavigate?.('dashboard')}
          variant="outline"
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </Button>
        <Button
          onPress={handleNext}
          style={styles.nextButton}
          disabled={!isFormValid}
        >
          <Text style={styles.nextButtonText}>Suivant</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  stepIndicator: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPreview: {
    width: 80,
    height: 80,
    position: 'relative',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: '#E9E9E9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoIcon: {
    fontSize: 32,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  inputContainer: {
    position: 'relative',
  },
  iconWrapper: {
    position: 'absolute',
    left: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    pointerEvents: 'none',
  },
  inputIcon: {
    fontSize: 18,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  pickerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm + 4,
  },
  pickerText: {
    flex: 1,
    minWidth: 0,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  pickerPlaceholder: {
    color: Colors.placeholder,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  pickerCancelButton: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
  },
  pickerDoneButton: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.primary,
  },
  picker: {
    width: '100%',
  },
  selectWrapper: {
    position: 'relative',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.sm + 4,
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
  cancelButton: {
    flex: 1,
    minHeight: 54,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1.5,
    minHeight: 54,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateShipmentStep1;
