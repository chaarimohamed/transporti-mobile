import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface CreateShipmentStep2Props {
  onNavigate?: (screen: string, data?: any) => void;
  initialData?: any;
}

const CreateShipmentStep2: React.FC<CreateShipmentStep2Props> = ({
  onNavigate,
  initialData,
}) => {
  // Initialise directly from initialData so values are always restored on back-navigation
  const [format, setFormat] = useState(initialData?.format || 'M');
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [showDimensions, setShowDimensions] = useState(!!initialData?.dimensions);
  const [height, setHeight] = useState(String(initialData?.dimensions?.height || ''));
  const [width, setWidth] = useState(String(initialData?.dimensions?.width || ''));
  const [length, setLength] = useState(String(initialData?.dimensions?.length || ''));
  const [specialInstructions, setSpecialInstructions] = useState(initialData?.specialInstructions || '');

  const handleNext = () => {
    const data = {
      ...initialData,
      format,
      dimensions: showDimensions ? { height, width, length } : null,
      specialInstructions,
      declaredValue: 0,
      insurance: false,
    };
    onNavigate?.('createShipmentStep3', data);
  };

  const isFormValid = format;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('addressDelivery', {
            ...initialData,
            format,
            dimensions: showDimensions ? { height, width, length } : null,
            specialInstructions,
            declaredValue: 0,
            insurance: false,
          })}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Détails supplémentaires</Text>
          <Text style={styles.stepIndicator}>2/3</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66.66%' }]} />
        </View>
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Package Format */}
        <View style={styles.section}>
          <Text style={styles.label}>Format du colis</Text>
          <TouchableOpacity
            style={styles.pickerInputContainer}
            onPress={() => setShowFormatPicker(true)}
          >
            <Text style={[styles.pickerText, !format && styles.pickerPlaceholder]}>
              {format === 'S' && 'Taille S - Tient dans une boîte à chaussures'}
              {format === 'M' && 'Taille M - Petit sac ou boîte'}
              {format === 'L' && 'Taille L - Boîte moyenne'}
              {format === 'XL' && 'Taille XL - Grande boîte ou meuble'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Format Picker Modal */}
        <Modal
          visible={showFormatPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowFormatPicker(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowFormatPicker(false)}
          >
            <View style={styles.pickerModal}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity onPress={() => setShowFormatPicker(false)}>
                  <Text style={styles.pickerCancelButton}>Annuler</Text>
                </TouchableOpacity>
                <Text style={styles.pickerTitle}>Format du colis</Text>
                <TouchableOpacity onPress={() => setShowFormatPicker(false)}>
                  <Text style={styles.pickerDoneButton}>Terminé</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={format}
                onValueChange={(itemValue) => setFormat(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Taille S - Boîte à chaussures" value="S" />
                <Picker.Item label="Taille M - Petit sac ou boîte" value="M" />
                <Picker.Item label="Taille L - Boîte moyenne" value="L" />
                <Picker.Item label="Taille XL - Grande boîte" value="XL" />
              </Picker>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Dimensions Checkbox */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setShowDimensions(!showDimensions)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, showDimensions && styles.checkboxActive]}>
              {showDimensions && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              Connaissez-vous les dimensions exactes ?
            </Text>
          </TouchableOpacity>

          {showDimensions && (
            <View style={styles.dimensionsGrid}>
              <View style={styles.dimensionInput}>
                <Text style={styles.dimensionLabel}>Hauteur</Text>
                <TextInput
                  style={styles.dimensionField}
                  placeholder="cm"
                  placeholderTextColor="#999"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dimensionInput}>
                <Text style={styles.dimensionLabel}>Largeur</Text>
                <TextInput
                  style={styles.dimensionField}
                  placeholder="cm"
                  placeholderTextColor="#999"
                  value={width}
                  onChangeText={setWidth}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.dimensionInput}>
                <Text style={styles.dimensionLabel}>Longueur</Text>
                <TextInput
                  style={styles.dimensionField}
                  placeholder="cm"
                  placeholderTextColor="#999"
                  value={length}
                  onChangeText={setLength}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={styles.label}>Instructions spéciales</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Code porte, contact sur place, etc."
            placeholderTextColor="#999"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>

        {/* Insurance — always OFF */}
        <Card style={styles.insuranceCard}>
          <View style={styles.insuranceContent}>
            <View style={styles.insuranceIcon}>
              <Text style={styles.insuranceIconText}>🛡️</Text>
            </View>
            <View style={styles.insuranceInfo}>
              <Text style={styles.insuranceTitle}>Assurance</Text>
              <Text style={styles.insuranceSubtitle}>Non disponible pour le moment</Text>
            </View>
          </View>
          <Text style={styles.insuranceOffLabel}>Non</Text>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          onPress={() => onNavigate?.('addressDelivery', {
            ...initialData,
            format,
            dimensions: showDimensions ? { height, width, length } : null,
            specialInstructions,
            declaredValue: 0,
            insurance: false,
          })}
          variant="outline"
          style={styles.backActionButton}
        >
          <Text style={styles.backButtonText}>Précédent</Text>
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
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666666',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1464F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginLeft: 4,
  },
  selectWrapper: {
    position: 'relative',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666666',
  },
  pickerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1464F6',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  pickerText: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  pickerPlaceholder: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  pickerCancelButton: {
    fontSize: 16,
    color: '#666666',
  },
  pickerDoneButton: {
    fontSize: 16,
    color: '#1464F6',
    fontWeight: '600',
  },
  picker: {
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E9E9E9',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: '#1464F6',
    backgroundColor: '#1464F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dimensionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  dimensionInput: {
    flex: 1,
    gap: 6,
  },
  dimensionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  dimensionField: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  textArea: {
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    padding: 16,
    fontSize: 15,
    color: '#1A1A1A',
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
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
  },
  insuranceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1464F6' + '1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insuranceIconText: {
    fontSize: 20,
  },
  insuranceInfo: {
    flex: 1,
  },
  insuranceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  insuranceSubtitle: {
    fontSize: 12,
    color: '#666666',
  },
  insuranceOffLabel: {
    fontSize: 14,
    color: '#999999',
    fontWeight: '500',
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
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: 12,
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
  backActionButton: {
    flex: 1,
    minHeight: 54,
  },
  backButtonText: {
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

export default CreateShipmentStep2;
