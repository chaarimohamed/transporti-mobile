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
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
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
              <AppIcon name="check-circle" size={14} color={Colors.surface} />
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
              <AppIcon name="camera" size={32} color={Colors.primary} />
              <Text style={styles.uploadHint}>Prendre une photo ou importer</Text>
              <Text style={styles.uploadFormats}>JPG · PNG · HEIC</Text>
            </View>
          )}
        </TouchableOpacity>

        {!hasPhoto && (
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={() => launchCamera(setter)}>
              <AppIcon name="camera" size={16} color={Colors.primary} />
              <Text style={styles.quickBtnText}>Caméra</Text>
            </TouchableOpacity>
            <View style={styles.quickBtnDivider} />
            <TouchableOpacity style={styles.quickBtn} onPress={() => launchGallery(setter)}>
              <AppIcon name="gallery-image" size={16} color={Colors.primary} />
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
            <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
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
          <AppIcon name="lock" size={16} color={Colors.primary} />
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
  container: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { flexGrow: 1, padding: Spacing.lg, paddingBottom: 120 },
  progressContainer: { marginTop: 32, marginBottom: 24 },
  backButton: { width: 32, height: 32, borderRadius: Radius.full, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  progressBar: { height: 4, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden', marginBottom: Spacing.sm },
  progressFill: { height: '100%', backgroundColor: Colors.primary },
  progressText: { fontFamily: Fonts.regular, fontSize: FontSizes.xs, color: Colors.textSecondary, textAlign: 'center' },
  header: { marginBottom: 24 },
  title: { fontFamily: Fonts.semiBold, fontSize: FontSizes.xl, color: Colors.charcoal, marginBottom: Spacing.sm },
  subtitle: { fontFamily: Fonts.regular, fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  docsContainer: { gap: Spacing.md },
  // doc card
  docCard: { borderWidth: 1, borderColor: Colors.border, borderRadius: Radius.lg, overflow: 'hidden', backgroundColor: Colors.backgroundAlt },
  docCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: Spacing.md, paddingBottom: Spacing.sm + 4 },
  docLabel: { fontFamily: Fonts.semiBold, fontSize: FontSizes.sm, color: Colors.textPrimary, marginBottom: 2 },
  required: { color: Colors.error },
  docDescription: { fontFamily: Fonts.regular, fontSize: FontSizes.xs, color: Colors.textSecondary },
  doneBadge: { width: 24, height: 24, borderRadius: Radius.full, backgroundColor: Colors.success, justifyContent: 'center', alignItems: 'center' },
  // upload zone
  uploadZone: { marginHorizontal: Spacing.md, height: 140, borderRadius: Radius.md, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.primary, backgroundColor: Colors.primarySurface, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  uploadZoneWithPhoto: { borderStyle: 'solid', borderColor: Colors.success, backgroundColor: '#000' },
  uploadZoneInner: { alignItems: 'center', gap: 4 },
  uploadHint: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: Colors.primary },
  uploadFormats: { fontFamily: Fonts.regular, fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  preview: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingVertical: 6, backgroundColor: Colors.overlay, alignItems: 'center' },
  previewOverlayText: { color: Colors.textInverse, fontFamily: Fonts.regular, fontSize: FontSizes.xs },
  // quick actions
  quickActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.borderLight, marginTop: Spacing.sm + 4 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: Spacing.sm + 4, gap: 6 },
  quickBtnDivider: { width: 1, backgroundColor: Colors.borderLight },
  quickBtnIcon: { fontSize: 16 },
  quickBtnText: { fontFamily: Fonts.medium, fontSize: FontSizes.sm, color: Colors.primary },
  // info
  infoContainer: { flexDirection: 'row', marginTop: 20, padding: 14, backgroundColor: Colors.primarySurface, borderRadius: Radius.md, alignItems: 'flex-start', gap: Spacing.sm },
  infoText: { flex: 1, fontFamily: Fonts.regular, fontSize: FontSizes.xs, color: Colors.primary, lineHeight: 18 },
  // buttons
  buttonContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: Spacing.lg, paddingBottom: 32, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, gap: Spacing.sm + 4 },
  skipButton: { flex: 1 },
  nextButton: { flex: 1 },
});

export default CarrierOnboarding3Screen;
