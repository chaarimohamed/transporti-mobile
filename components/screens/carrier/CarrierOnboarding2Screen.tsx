import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
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
    onNavigate?.('carrierOnboarding3', selectedOptions);
  };

  const handleSkip = () => {
    onNavigate?.('carrierOnboarding3');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
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
            <Text style={styles.optionIcon}>📦</Text>
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
            <Text style={styles.optionIcon}>❄️</Text>
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionLabel}>Réfrigéré</Text>
              <Text style={styles.optionDescription}>Véhicule avec système de réfrigération</Text>
            </View>
          </TouchableOpacity>

          {/* Volume Option */}
          <View style={styles.volumeCard}>
            <View style={styles.volumeHeader}>
              <Text style={styles.volumeIcon}>🚚</Text>
              <View style={styles.volumeHeaderText}>
                <Text style={styles.volumeTitle}>Taille du véhicule</Text>
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
                  onPress={() =>
                    setSelectedOptions(prev => ({
                      ...prev,
                      volume: option.value,
                    }))
                  }
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
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSkip}
          variant="secondary"
          size="lg"
          style={styles.skipButton}
        >
          Passer
        </Button>
        <Button
          onPress={handleNext}
          size="lg"
          style={styles.nextButton}
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
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 120,
  },
  progressContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E9E9E9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1464F6',
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 16,
    backgroundColor: '#FCFCFC',
  },
  optionCardSelected: {
    borderColor: '#1464F6',
    backgroundColor: 'rgba(20, 100, 246, 0.05)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#AFAFAF',
    borderRadius: 4,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 12,
    height: 12,
    backgroundColor: '#1464F6',
    borderRadius: 2,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  volumeCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 16,
    backgroundColor: '#FCFCFC',
  },
  volumeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  volumeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  volumeHeaderText: {
    flex: 1,
  },
  volumeTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  volumeSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 16,
  },
  volumeOptionsContainer: {
    gap: 8,
  },
  volumeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 12,
  },
  volumeOptionSelected: {
    borderColor: '#1464F6',
    backgroundColor: 'rgba(20, 100, 246, 0.05)',
  },
  volumeRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#AFAFAF',
    borderRadius: 10,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeRadioChecked: {
    width: 10,
    height: 10,
    backgroundColor: '#1464F6',
    borderRadius: 5,
  },
  volumeOptionTextContainer: {
    flex: 1,
  },
  volumeOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  volumeOptionTextSelected: {
    fontWeight: '500',
    color: '#1464F6',
  },
  volumeOptionDescription: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    gap: 12,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 1,
  },
});

export default CarrierOnboarding2Screen;
