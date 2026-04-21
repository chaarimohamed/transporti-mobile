import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { Colors } from '../../../theme';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../ui/Button';

interface DocumentState {
  uri: string | null;
  base64: string | null;
}

interface CarrierOnboarding3ScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

const EMPTY_DOC: DocumentState = { uri: null, base64: null };

const CarrierOnboarding3Screen: React.FC<CarrierOnboarding3ScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [cinDoc, setCinDoc] = useState<DocumentState>(EMPTY_DOC);
  const [permisDoc, setPermisDoc] = useState<DocumentState>(EMPTY_DOC);

  // --- Permissions ---
  const requestCameraPermission = async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "Veuillez autoriser l'accès à la caméra dans les paramètres.");
      return false;
    }
    return true;
  };

  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Veuillez autoriser l'accès à la galerie dans les paramètres.");
        return false;
      }
    }
    return true;
  };

  // --- Launch pickers ---
  const launchCamera = async (setter: (d: DocumentState) => void) => {
    if (!(await requestCameraPermission())) return;
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      setter({ uri: a.uri, base64: a.base64 ?? null });
    }
  };

  const launchGallery = async (setter: (d: DocumentState) => void) => {
    if (!(await requestGalleryPermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets[0]) {
      const a = result.assets[0];
      setter({ uri: a.uri, base64: a.base64 ?? null });
    }
  };

  // --- Action sheet ---
  const handlePickDocument = (docType: 'cin' | 'permis') => {
    const setter = docType === 'cin' ? setCinDoc : setPermisDoc;
    const label = docType === 'cin' ? 'CIN' : 'Permis de conduire';
    Alert.alert(`Ajouter ${label}`, 'Choisissez une source', [
      { text: '📷  Prendre une photo', onPress: () => launchCamera(setter) },
      { text: '🖼️  Galerie', onPress: () => launchGallery(setter) },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  // --- Navigation ---
  const handleNext = () => {
    if (!cinDoc.uri || !permisDoc.uri) {
      Alert.alert('Documents requis', 'Veuillez fournir votre CIN et votre Permis de conduire.');
      return;
    }
    onNavigate?.('carrierOnboarding4', {
      ...initialData,
      documents: { cinBase64: cinDoc.base64, permisBase64: permisDoc.base64 },
    });
  };

  const handleSkip = () => {
    onNavigate?.('carrierOnboarding4', initialData);
  };

  // --- Card renderer ---
  const renderDocCard = (
    docType: 'cin' | 'permis',
    doc: DocumentState,
    label: string,
    description: string
  ) => {
    const hasPhoto = !!doc.uri;
    const setter = docType === 'cin' ? setCinDoc : setPermisDoc;
    return (
      <View style={styles.docCard}>
        <View style={styles.docCardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.docLabel}>
              {label} <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.docDescription}>{description}</Text>
          </View>
          {hasPhoto && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeText}>✓</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.uploadZone, hasPhoto && styles.uploadZoneWithPhoto]}
          onPress={() => handlePickDocument(docType)}
          activeOpacity={0.75}
        >
          {hasPhoto ? (
            <>
              <Image source={{ uri: doc.uri! }} style={styles.preview} resizeMode="cover" />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewOverlayText}>Appuyer pour changer</Text>
              </View>
            </>
          ) : (
            <View style={styles.uploadZoneInner}>
              <Text style={styles.uploadIcon}>📷</Text>
              <Text style={styles.uploadHint}>Prendre une photo ou importer</Text>
              <Text style={styles.uploadFormats}>JPG · PNG · HEIC</Text>
            </View>
          )}
        </TouchableOpacity>

        {!hasPhoto && (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => launchCamera(setter)}>
              <Text style={styles.quickBtnIcon}>📷</Text>
              <Text style={styles.quickBtnText}>Caméra</Text>
            </TouchableOpacity>
            <View style={styles.quickBtnDivider} />
            <TouchableOpacity style={styles.quickBtn} onPress={() => launchGallery(setter)}>
              <Text style={styles.quickBtnIcon}>🖼️</Text>
              <Text style={styles.quickBtnText}>Galerie</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Progress */}
        <View style={styles.progressContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => onNavigate?.('carrierOnboarding2')} activeOpacity={0.7}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '66%' }]} />
          </View>
          <Text style={styles.progressText}>Étape 2 sur 3</Text>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Documents</Text>
          <Text style={styles.subtitle}>
            Photographiez ou importez vos documents officiels. Ils seront chiffrés et stockés en sécurité.
          </Text>
        </View>

        {/* Doc cards */}
        <View style={styles.docsContainer}>
          {renderDocCard('cin', cinDoc, "Carte d'identité nationale (CIN)", 'Recto visible, bonne luminosité')}
          {renderDocCard('permis', permisDoc, 'Permis de conduire', 'Les deux faces si possible')}
        </View>

        {/* Security info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoText}>
            Vos documents sont chiffrés (AES-256) avant d'être stockés. Seule l'équipe Transporti y a accès pour vérification.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button onPress={handleSkip} variant="secondary" size="lg" style={styles.skipButton}>
          Passer
        </Button>
        <Button onPress={handleNext} size="lg" style={styles.nextButton}>
          Suivant
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 120 },
  progressContainer: { marginTop: 32, marginBottom: 24 },
  backButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  backIcon: { fontSize: 20, color: '#1A1A1A' },
  progressBar: { height: 4, backgroundColor: '#E9E9E9', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: Colors.primary },
  progressText: { fontSize: 12, color: '#666666', textAlign: 'center' },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '600', color: '#444444', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666666', lineHeight: 20 },
  docsContainer: { gap: 16 },
  // doc card
  docCard: { borderWidth: 1, borderColor: '#E9E9E9', borderRadius: 16, overflow: 'hidden', backgroundColor: '#FCFCFC' },
  docCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: 16, paddingBottom: 12 },
  docLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A', marginBottom: 2 },
  required: { color: Colors.error },
  docDescription: { fontSize: 12, color: '#888888' },
  doneBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#2E8B57', justifyContent: 'center', alignItems: 'center' },
  doneBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  // upload zone
  uploadZone: { marginHorizontal: 16, height: 140, borderRadius: 12, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.primary, backgroundColor: '#F0F7FF', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  uploadZoneWithPhoto: { borderStyle: 'solid', borderColor: '#2E8B57', backgroundColor: '#000' },
  uploadZoneInner: { alignItems: 'center', gap: 4 },
  uploadIcon: { fontSize: 32, marginBottom: 4 },
  uploadHint: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  uploadFormats: { fontSize: 11, color: '#888888', marginTop: 2 },
  preview: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 6, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center' },
  previewOverlayText: { color: '#FFFFFF', fontSize: 12 },
  // quick actions
  quickActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEEEEE', marginTop: 12 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  quickBtnDivider: { width: 1, backgroundColor: '#EEEEEE' },
  quickBtnIcon: { fontSize: 16 },
  quickBtnText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  // info
  infoContainer: { flexDirection: 'row', marginTop: 20, padding: 14, backgroundColor: '#F0F7FF', borderRadius: 12, alignItems: 'flex-start' },
  infoIcon: { fontSize: 16, marginRight: 8, marginTop: 1 },
  infoText: { flex: 1, fontSize: 12, color: Colors.primary, lineHeight: 18 },
  // buttons
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 24, paddingBottom: 32, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E9E9E9', gap: 12 },
  skipButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default CarrierOnboarding3Screen;
