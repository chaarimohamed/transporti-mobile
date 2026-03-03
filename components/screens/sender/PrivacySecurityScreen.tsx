import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

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
          <Text style={styles.backIcon}>←</Text>
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
        <Text style={styles.mainTitle}>🔒 SÉCURITÉ DES DONNÉES</Text>

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
    backgroundColor: '#F6F6F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
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
    padding: 24,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
  divider: {
    height: 2,
    backgroundColor: '#E9E9E9',
    marginVertical: 32,
  },
  contactBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  contactText: {
    fontSize: 14,
    color: '#1464F6',
    marginBottom: 8,
  },
  footer: {
    height: 20,
  },
});

export default PrivacySecurityScreen;
