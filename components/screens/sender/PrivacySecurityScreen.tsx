import React from 'react';
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

interface PrivacySecurityScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  returnScreen?: string;
}

const PrivacySecurityScreen: React.FC<PrivacySecurityScreenProps> = ({
  onNavigate,
  returnScreen = 'profile',
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.(returnScreen)}
        >
          <AppIcon name="arrow-back" size={20} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité et Confidentialité</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>POLITIQUE DE CONFIDENTIALITÉ</Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Données collectées</Text>
          <Text style={styles.paragraph}>Transporti peut collecter :</Text>
          <Text style={styles.bullet}>• données d'identification (nom, téléphone),</Text>
          <Text style={styles.bullet}>• informations véhicule et documents,</Text>
          <Text style={styles.bullet}>
            • <Text style={styles.bold}>données de localisation GPS en temps réel</Text>,
          </Text>
          <Text style={styles.bullet}>• données d'utilisation de la plateforme.</Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Finalité</Text>
          <Text style={styles.paragraph}>Les données sont utilisées pour :</Text>
          <Text style={styles.bullet}>• la mise en relation entre utilisateurs,</Text>
          <Text style={styles.bullet}>• l'amélioration du service,</Text>
          <Text style={styles.bullet}>• la sécurité de la plateforme.</Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Partage des données</Text>
          <Text style={styles.paragraph}>
            Certaines données peuvent être partagées <Text style={styles.bold}>entre expéditeurs et transporteurs</Text> dans le cadre d'une mission.
          </Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Droits des utilisateurs</Text>
          <Text style={styles.paragraph}>
            Conformément à la législation tunisienne :
          </Text>
          <Text style={styles.bullet}>• accès,</Text>
          <Text style={styles.bullet}>• rectification,</Text>
          <Text style={styles.bullet}>• suppression des données sur demande.</Text>
          <Text style={styles.paragraph}>
            Les utilisateurs peuvent demander la <Text style={styles.bold}>suppression de leur compte</Text>.
          </Text>
        </View>

        {/* Security Section */}
        <View style={styles.divider} />
        <View style={styles.mainTitleRow}>
          <AppIcon name="lock" size={22} color={Colors.charcoal} />
          <Text style={styles.mainTitle}>SÉCURITÉ DES DONNÉES</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Protection de vos informations</Text>
          <Text style={styles.paragraph}>
            Transporti met en œuvre des mesures techniques et organisationnelles pour protéger vos données personnelles contre :
          </Text>
          <Text style={styles.bullet}>• l'accès non autorisé,</Text>
          <Text style={styles.bullet}>• la perte ou la divulgation accidentelle,</Text>
          <Text style={styles.bullet}>• la destruction ou l'altération des données.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conservation des données</Text>
          <Text style={styles.paragraph}>
            Vos données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles ont été collectées, et conformément aux obligations légales applicables.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vos droits</Text>
          <Text style={styles.paragraph}>
            Vous disposez des droits suivants concernant vos données personnelles :
          </Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Droit d'accès</Text> : obtenir une copie de vos données,</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Droit de rectification</Text> : corriger des données inexactes,</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Droit à l'effacement</Text> : demander la suppression de vos données,</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Droit d'opposition</Text> : vous opposer au traitement de vos données,</Text>
          <Text style={styles.bullet}>• <Text style={styles.bold}>Droit à la portabilité</Text> : recevoir vos données dans un format structuré.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.paragraph}>
            Pour toute question relative à la confidentialité de vos données ou pour exercer vos droits, contactez-nous :
          </Text>
          <View style={styles.contactBox}>
            <Text style={styles.contactText}>📧 Email : support@transporti.tn</Text>
            <Text style={styles.contactText}>📱 Téléphone : +216 XX XXX XXX</Text>
          </View>
        </View>

        <View style={styles.footer} />
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
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
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
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  mainTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 20,
  },
  mainTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm + 4,
  },
  paragraph: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  bullet: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    lineHeight: 22,
    marginLeft: Spacing.sm,
    marginBottom: 4,
  },
  bold: {
    fontFamily: Fonts.bold,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: 32,
  },
  contactBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  contactText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    marginBottom: Spacing.sm,
  },
  footer: {
    height: 20,
  },
});

export default PrivacySecurityScreen;
