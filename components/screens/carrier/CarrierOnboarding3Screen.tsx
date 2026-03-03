import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Button } from '../../ui/Button';

interface CarrierOnboarding3ScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  route?: { params?: any };
}

const CarrierOnboarding3Screen: React.FC<CarrierOnboarding3ScreenProps> = ({
  onNavigate,
  route,
}) => {
  const [documents, setDocuments] = useState({
    cin: false,
    permis: false,
  });

  const handleUploadDocument = (docType: 'cin' | 'permis') => {
    // Simulate document upload
    Alert.alert(
      'Télécharger document',
      `Voulez-vous télécharger votre ${docType === 'cin' ? 'CIN' : 'Permis'} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Télécharger',
          onPress: () => {
            setDocuments(prev => ({ ...prev, [docType]: true }));
            Alert.alert('Succès', 'Document téléchargé avec succès');
          },
        },
      ]
    );
  };

  const handleNext = () => {
    if (!documents.cin || !documents.permis) {
      Alert.alert(
        'Documents requis',
        'Veuillez télécharger tous les documents obligatoires (CIN et Permis)'
      );
      return;
    }
    onNavigate?.('carrierOnboarding4', {
      ...route?.params,
      documents,
    });
  };

  const handleSkip = () => {
    onNavigate?.('carrierOnboarding4', route?.params);
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
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Étape 2 sur 3</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Documents</Text>
          <Text style={styles.subtitle}>
            Téléchargez vos documents officiels
          </Text>
        </View>

        {/* Document Upload Cards */}
        <View style={styles.documentsContainer}>
          {/* CIN Upload */}
          <TouchableOpacity
            style={[
              styles.uploadCard,
              documents.cin && styles.uploadCardSuccess,
            ]}
            onPress={() => handleUploadDocument('cin')}
            activeOpacity={0.7}
          >
            <Text style={styles.uploadIcon}>
              {documents.cin ? '✓' : '📤'}
            </Text>
            <Text
              style={[
                styles.uploadText,
                documents.cin && styles.uploadTextSuccess,
              ]}
            >
              {documents.cin ? 'CIN téléchargé' : 'CIN*'}
            </Text>
          </TouchableOpacity>

          {/* Permis Upload */}
          <TouchableOpacity
            style={[
              styles.uploadCard,
              documents.permis && styles.uploadCardSuccess,
            ]}
            onPress={() => handleUploadDocument('permis')}
            activeOpacity={0.7}
          >
            <Text style={styles.uploadIcon}>
              {documents.permis ? '✓' : '📤'}
            </Text>
            <Text
              style={[
                styles.uploadText,
                documents.permis && styles.uploadTextSuccess,
              ]}
            >
              {documents.permis ? 'Permis téléchargé' : 'Permis*'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Les champs marqués d'un astérisque (*) sont obligatoires pour
            pouvoir commencer à recevoir des missions.
          </Text>
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
  documentsContainer: {
    gap: 16,
  },
  uploadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#1464F6',
    borderRadius: 16,
    backgroundColor: '#F0F7FF',
  },
  uploadCardSuccess: {
    borderStyle: 'solid',
    borderColor: '#2E8B57',
    backgroundColor: '#E8F5E9',
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1464F6',
  },
  uploadTextSuccess: {
    color: '#2E8B57',
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#F0F7FF',
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1464F6',
    lineHeight: 18,
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

export default CarrierOnboarding3Screen;
