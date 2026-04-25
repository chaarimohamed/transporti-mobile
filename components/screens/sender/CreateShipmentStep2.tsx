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
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { Picker } from '@react-native-picker/picker';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AppIcon } from '../../ui/Icon';

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
          <AppIcon name="arrow-back" size={22} color={Colors.charcoal} />
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
            <AppIcon name="caret-down" size={16} color={Colors.textMuted} />
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
              {showDimensions && <AppIcon name="selection-check" size={12} color={Colors.textInverse} weight="bold" />}
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
              <AppIcon name="insurance-shield" size={22} color={Colors.primary} />
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
  selectWrapper: {
    position: 'relative',
  },
  pickerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm + 4,
  },
  pickerText: {
    flex: 1,
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    paddingVertical: 4,
    marginBottom: Spacing.sm + 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: Radius.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  checkboxLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  dimensionsGrid: {
    flexDirection: 'row',
    gap: Spacing.sm + 4,
    marginTop: Spacing.sm + 4,
  },
  dimensionInput: {
    flex: 1,
    gap: 6,
  },
  dimensionLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  dimensionField: {
    height: 48,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.sm + 4,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  textArea: {
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  insuranceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  insuranceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
    flex: 1,
  },
  insuranceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insuranceInfo: {
    flex: 1,
  },
  insuranceTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  insuranceSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  insuranceOffLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.placeholder,
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
