import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AppIcon } from '../../ui/Icon';
import ShipmentFormatIcon from '../../ui/ShipmentFormatIcon';

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
  const [showDimensions, setShowDimensions] = useState(!!initialData?.dimensions);
  const [height, setHeight] = useState(String(initialData?.dimensions?.height || ''));
  const [width, setWidth] = useState(String(initialData?.dimensions?.width || ''));
  const [length, setLength] = useState(String(initialData?.dimensions?.length || ''));
  const [specialInstructions, setSpecialInstructions] = useState(initialData?.specialInstructions || '');
  const [budget, setBudget] = useState(String(initialData?.budget || ''));

  const handleNext = () => {
    const data = {
      ...initialData,
      format,
      dimensions: showDimensions ? { height, width, length } : null,
      specialInstructions,
      declaredValue: 0,
      insurance: false,
      budget: budget ? parseFloat(budget) : null,
    };
    onNavigate?.('createShipmentStep3', data);
  };

  const isFormValid = format;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
      style={styles.keyboardAvoidingView}
    >
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
            budget: budget ? parseFloat(budget) : null,
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
          keyboardShouldPersistTaps="handled"
        >
        {/* Package Format */}
        <View style={styles.section}>
          <Text style={styles.label}>Format du colis</Text>
          <View style={styles.formatGrid}>
            {[
              {
                value: 'S',
                label: 'Petit colis',
                subtitle: 'Document',
                examples: 'Vêtements, chaussures, livres',
                icon: <ShipmentFormatIcon format="S" size={26} color={format === 'S' ? Colors.primary : Colors.textMuted} />,
              },
              {
                value: 'M',
                label: 'Sac / Valise',
                subtitle: 'Moyen',
                examples: 'Bagages, électronique, caisses',
                icon: <ShipmentFormatIcon format="M" size={26} color={format === 'M' ? Colors.primary : Colors.textMuted} />,
              },
              {
                value: 'L',
                label: 'Meuble / Électroménager',
                subtitle: 'Grand',
                examples: 'Frigo, canapé, télévision',
                icon: <ShipmentFormatIcon format="L" size={26} color={format === 'L' ? Colors.primary : Colors.textMuted} />,
              },
              {
                value: 'XL',
                label: 'Déménagement',
                subtitle: 'Très grand',
                examples: 'Piano, armoire, contenu entier',
                icon: <ShipmentFormatIcon format="XL" size={26} color={format === 'XL' ? Colors.primary : Colors.textMuted} />,
              },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.formatCard,
                  format === option.value && styles.formatCardSelected,
                ]}
                onPress={() => setFormat(option.value)}
                activeOpacity={0.7}
              >
                <View style={styles.formatCardIcon}>{option.icon}</View>
                <View style={styles.formatCardInfo}>
                  <Text style={[
                    styles.formatCardLabel,
                    format === option.value && styles.formatCardLabelSelected,
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.formatCardExamples}>{option.examples}</Text>
                </View>
                <View style={[
                  styles.formatCardRadio,
                  format === option.value && styles.formatCardRadioSelected,
                ]}>
                  {format === option.value && (
                    <View style={styles.formatCardRadioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.label}>Budget (optionnel)</Text>
          <Text style={styles.budgetHint}>Les transporteurs peuvent proposer un prix différent.</Text>
          <TextInput
            style={styles.budgetInput}
            placeholder="ex: 80 DT"
            placeholderTextColor="#999"
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
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
            budget: budget ? parseFloat(budget) : null,
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
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
  formatGrid: {
    gap: Spacing.sm + 4,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  formatCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  formatCardIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatCardInfo: {
    flex: 1,
  },
  formatCardLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  formatCardLabelSelected: {
    color: Colors.primary,
  },
  formatCardExamples: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  formatCardRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatCardRadioSelected: {
    borderColor: Colors.primary,
  },
  formatCardRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
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
  budgetHint: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },

  budgetInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.md,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },

});

export default CreateShipmentStep2;
