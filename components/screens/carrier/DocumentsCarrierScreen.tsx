import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppIcon } from '../../ui/Icon';
import { Colors, FontSizes, Fonts, Radius, Spacing } from '../../../theme';
import * as authService from '../../../services/authService';

interface DocumentsCarrierScreenProps {
  onNavigate?: (screen: string, params?: unknown) => void;
}

type CarrierDocumentKind = 'cin' | 'permis';

const DocumentsCarrierScreen: React.FC<DocumentsCarrierScreenProps> = ({
  onNavigate,
}) => {
  const [isUploading, setIsUploading] = useState<CarrierDocumentKind | null>(null);
  const [documentsInfo, setDocumentsInfo] = useState({
    cinUploaded: false,
    permisUploaded: false,
    uploadedAt: '',
  });

  useEffect(() => {
    authService.getDocuments().then((res) => {
      if (res.success) {
        setDocumentsInfo({
          cinUploaded: Boolean(res.cinBase64),
          permisUploaded: Boolean(res.permisBase64),
          uploadedAt: res.uploadedAt ? new Date(res.uploadedAt).toLocaleDateString('fr-FR') : '',
        });
      }
    });
  }, []);

  const uploadCarrierDocument = async (kind: CarrierDocumentKind, source: 'camera' | 'gallery') => {
    try {
      setIsUploading(kind);

      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permission refusée', source === 'camera' ? "L'accès à la caméra est requis" : "L'accès à la galerie est requis");
        return;
      }

      const pickerResult = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.7,
            base64: true,
          });

      if (pickerResult.canceled || !pickerResult.assets[0]?.base64) {
        return;
      }

      const uploadResult = await authService.uploadDocuments(
        kind === 'cin'
          ? { cinBase64: pickerResult.assets[0].base64 }
          : { permisBase64: pickerResult.assets[0].base64 }
      );

      if (!uploadResult.success) {
        Alert.alert('Erreur', uploadResult.error || 'Impossible de mettre à jour le document');
        return;
      }

      setDocumentsInfo((prev) => ({
        cinUploaded: kind === 'cin' ? true : prev.cinUploaded,
        permisUploaded: kind === 'permis' ? true : prev.permisUploaded,
        uploadedAt: uploadResult.uploadedAt ? new Date(uploadResult.uploadedAt).toLocaleDateString('fr-FR') : prev.uploadedAt,
      }));

      Alert.alert('Succès', 'Document mis à jour avec succès');
    } catch (error) {
      console.error('Error uploading carrier document:', error);
      Alert.alert('Erreur', 'Erreur de connexion lors du téléchargement');
    } finally {
      setIsUploading(null);
    }
  };

  const handleDocumentAction = (kind: CarrierDocumentKind) => {
    const label = kind === 'cin' ? 'la CIN' : 'le permis';
    Alert.alert(`Mettre à jour ${label}`, 'Choisissez une source', [
      { text: 'Prendre une photo', onPress: () => uploadCarrierDocument(kind, 'camera') },
      { text: 'Choisir dans la galerie', onPress: () => uploadCarrierDocument(kind, 'gallery') },
      { text: 'Annuler', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => onNavigate?.('profileCarrier')} activeOpacity={0.7}>
          <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <AppIcon name="document" size={24} color={Colors.primaryDark} />
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>Justificatifs du transporteur</Text>
            <Text style={styles.heroSubtitle}>
              Ajoutez ou remplacez vos documents officiels depuis cet espace dédié.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.documentCard} onPress={() => handleDocumentAction('cin')} activeOpacity={0.75}>
          <View style={styles.documentIconWrap}>
            <AppIcon name="document" size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.documentBody}>
            <Text style={styles.documentTitle}>Carte d'identité nationale</Text>
            <Text style={styles.documentSubtitle}>
              {documentsInfo.cinUploaded ? 'Document déjà enregistré' : 'Touchez pour importer votre CIN'}
            </Text>
          </View>
          <Text style={documentsInfo.cinUploaded ? styles.documentReadyText : styles.documentActionText}>
            {isUploading === 'cin' ? 'Envoi...' : documentsInfo.cinUploaded ? 'Chargée' : 'Importer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.documentCard} onPress={() => handleDocumentAction('permis')} activeOpacity={0.75}>
          <View style={styles.documentIconWrap}>
            <AppIcon name="verified-shield" size={20} color={Colors.primaryDark} />
          </View>
          <View style={styles.documentBody}>
            <Text style={styles.documentTitle}>Permis de conduire</Text>
            <Text style={styles.documentSubtitle}>
              {documentsInfo.permisUploaded ? 'Document déjà enregistré' : 'Touchez pour importer votre permis'}
            </Text>
          </View>
          <Text style={documentsInfo.permisUploaded ? styles.documentReadyText : styles.documentActionText}>
            {isUploading === 'permis' ? 'Envoi...' : documentsInfo.permisUploaded ? 'Chargé' : 'Importer'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerCard}>
          <AppIcon name="lock" size={16} color={Colors.primaryDark} />
          <Text style={styles.footerText}>
            {documentsInfo.uploadedAt
              ? `Dernière mise à jour: ${documentsInfo.uploadedAt}`
              : 'Vos documents restent chiffrés et peuvent être mis à jour à tout moment.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 72,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  heroCard: {
    flexDirection: 'row',
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  heroIconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.base,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  documentIconWrap: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm + 4,
  },
  documentBody: {
    flex: 1,
  },
  documentTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  documentSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  documentActionText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.primaryDark,
    marginLeft: Spacing.sm,
  },
  documentReadyText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginLeft: Spacing.sm,
  },
  footerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  footerText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default DocumentsCarrierScreen;