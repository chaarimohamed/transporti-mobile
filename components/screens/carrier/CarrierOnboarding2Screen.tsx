import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Button } from '../../ui/Button';

interface CarrierOnboarding2ScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const CarrierOnboarding2Screen: React.FC<CarrierOnboarding2ScreenProps> = ({
  onNavigate,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<{
    palette: boolean;
    refrigere: boolean;
    volume: string;
  }>({
    palette: false,
    refrigere: false,
    volume: '',
  });
  const [volumeError, setVolumeError] = useState(false);

  const volumeOptions = [
    { value: 'S', label: 'S — Petit véhicule', description: 'Caddy, Berlingo (~3m³)' },
    { value: 'M', label: 'M — Fourgonnette', description: 'Transit, Sprinter (~10m³)' },
    { value: 'L', label: 'L — Camion léger', description: 'Jusqu\'à 3.5T (~20m³)' },
    { value: 'XL', label: 'XL — Camion plateau', description: 'Plus de 3.5T (~40m³)' },
  ];

  const handleToggleOption = (option: 'palette' | 'refrigere') => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleNext = () => {
    if (!selectedOptions.volume) {
      setVolumeError(true);
      return;
    }
    onNavigate?.('carrierOnboarding3', selectedOptions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => onNavigate?.('carrierRegister')}
            activeOpacity={0.7}
          >
            <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
          <Text style={styles.progressText}>Étape 1 sur 3</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Capacités de votre véhicule</Text>
          <Text style={styles.subtitle}>
            Sélectionnez les types de marchandises que vous pouvez transporter et la taille de votre véhicule
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {/* Palette Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOptions.palette && styles.optionCardSelected,
            ]}
            onPress={() => handleToggleOption('palette')}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedOptions.palette && (
                <View style={styles.checkboxChecked} />
              )}
            </View>
            <View style={{ marginRight: 12 }}>
              <AppIcon name="package" size={24} color={Colors.charcoal} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionLabel}>Palette</Text>
              <Text style={styles.optionDescription}>Transport de palettes</Text>
            </View>
          </TouchableOpacity>

          {/* Refrigere Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedOptions.refrigere && styles.optionCardSelected,
            ]}
            onPress={() => handleToggleOption('refrigere')}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {selectedOptions.refrigere && (
                <View style={styles.checkboxChecked} />
              )}
            </View>
            <View style={{ marginRight: 12 }}>
              <AppIcon name="temperature-cold" size={24} color={Colors.charcoal} />
            </View>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionLabel}>Réfrigéré</Text>
              <Text style={styles.optionDescription}>Véhicule avec système de réfrigération</Text>
            </View>
          </TouchableOpacity>

          {/* Volume Option */}
          <View style={[styles.volumeCard, volumeError && styles.volumeCardError]}>
            <View style={styles.volumeHeader}>
              <View style={{ marginRight: 12 }}>
                <AppIcon name="truck" size={24} color={Colors.charcoal} />
              </View>
              <View style={styles.volumeHeaderText}>
                <Text style={styles.volumeTitle}>Taille du véhicule <Text style={styles.required}>*</Text></Text>
                <Text style={styles.volumeSubtitle}>
                  Sélectionnez la catégorie correspondant à votre véhicule
                </Text>
              </View>
            </View>

            <View style={styles.volumeOptionsContainer}>
              {volumeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.volumeOption,
                    selectedOptions.volume === option.value &&
                      styles.volumeOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedOptions(prev => ({ ...prev, volume: option.value }));
                    setVolumeError(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.volumeRadio}>
                    {selectedOptions.volume === option.value && (
                      <View style={styles.volumeRadioChecked} />
                    )}
                  </View>
                  <View style={styles.volumeOptionTextContainer}>
                    <Text
                      style={[
                        styles.volumeOptionText,
                        selectedOptions.volume === option.value &&
                          styles.volumeOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    <Text style={styles.volumeOptionDescription}>
                      {option.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {volumeError && (
              <Text style={styles.volumeErrorText}>
                Veuillez sélectionner la taille de votre véhicule
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleNext}
          size="lg"
          style={styles.nextButton}
          disabled={!selectedOptions.volume}
        >
          Suivant
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
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingBottom: 120,
  },
  progressContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    color: Colors.charcoal,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  optionsContainer: {
    gap: Spacing.sm + 4,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.backgroundAlt,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    borderRadius: Radius.xs,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  optionDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  volumeCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    backgroundColor: Colors.backgroundAlt,
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm + 4,
  },
  volumeHeaderText: {
    flex: 1,
  },
  volumeTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  volumeSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  volumeOptionsContainer: {
    gap: Spacing.sm,
  },
  volumeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
  },
  volumeOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  volumeRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.textMuted,
    borderRadius: 10,
    marginRight: Spacing.sm + 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeRadioChecked: {
    width: 10,
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  volumeOptionTextContainer: {
    flex: 1,
  },
  volumeOptionText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  volumeOptionTextSelected: {
    fontFamily: Fonts.medium,
    color: Colors.primary,
  },
  volumeOptionDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  volumeCardError: {
    borderColor: Colors.error,
    backgroundColor: 'rgba(217, 45, 32, 0.03)',
  },
  required: {
    color: Colors.error,
  },
  volumeErrorText: {
    color: Colors.error,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    marginTop: Spacing.sm,
    marginLeft: 4,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: 32,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  nextButton: {
    width: '100%',
  },
});

export default CarrierOnboarding2Screen;
