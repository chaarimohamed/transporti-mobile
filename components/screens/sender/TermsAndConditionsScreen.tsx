import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../../theme';

interface TermsAndConditionsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  returnScreen?: string;
}

const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = ({
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
        <Text style={styles.headerTitle}>Conditions Générales</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.mainTitle}>CONDITIONS GÉNÉRALES D'UTILISATION</Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Objet de la plateforme</Text>
          <Text style={styles.paragraph}>
            Transporti est une <Text style={styles.bold}>plateforme numérique de mise en relation</Text> entre :
          </Text>
          <Text style={styles.bullet}>• des <Text style={styles.bold}>expéditeurs</Text> souhaitant transporter des marchandises, et</Text>
          <Text style={styles.bullet}>• des <Text style={styles.bold}>transporteurs indépendants</Text> proposant des services de transport.</Text>
          <Text style={styles.highlight}>
            👉 Transporti <Text style={styles.bold}>n'est pas une entreprise de transport</Text>, <Text style={styles.bold}>n'exécute aucun transport</Text> et <Text style={styles.bold}>n'est pas partie au contrat</Text> conclu entre expéditeur et transporteur.
          </Text>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Acceptation des conditions</Text>
          <Text style={styles.paragraph}>
            L'utilisation de la plateforme implique l'acceptation pleine et entière des présentes CGU.
          </Text>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Rôle et responsabilité de Transporti</Text>
          <Text style={styles.paragraph}>
            Transporti agit exclusivement comme <Text style={styles.bold}>intermédiaire technique</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Transporti <Text style={styles.bold}>n'assume aucune responsabilité</Text>, notamment en cas de :
          </Text>
          <Text style={styles.bullet}>• perte, vol ou détérioration des marchandises,</Text>
          <Text style={styles.bullet}>• retard de livraison,</Text>
          <Text style={styles.bullet}>• litige entre expéditeur et transporteur,</Text>
          <Text style={styles.bullet}>• inexécution ou mauvaise exécution du transport.</Text>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Comptes utilisateurs</Text>
          <Text style={styles.paragraph}>Chaque utilisateur s'engage à :</Text>
          <Text style={styles.bullet}>• fournir des informations exactes et à jour,</Text>
          <Text style={styles.bullet}>• ne pas utiliser la plateforme à des fins frauduleuses ou illégales.</Text>
          <Text style={styles.paragraph}>
            Transporti se réserve le droit de <Text style={styles.bold}>suspendre ou supprimer un compte</Text> en cas de fraude ou de non-respect des CGU.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Gratuité – Évolution du modèle</Text>
          <Text style={styles.paragraph}>
            L'utilisation de Transporti est <Text style={styles.bold}>gratuite pendant la phase MVP</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Transporti se réserve le droit d'introduire des <Text style={styles.bold}>frais ou commissions ultérieurement</Text>, sous réserve d'information préalable des utilisateurs.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Droit applicable</Text>
          <Text style={styles.paragraph}>
            Les présentes CGU sont soumises au <Text style={styles.bold}>droit tunisien</Text>.
          </Text>
          <Text style={styles.paragraph}>
            Tout litige relève de la compétence des <Text style={styles.bold}>tribunaux tunisiens</Text>.
          </Text>
        </View>

        {/* Transporteurs */}
        <View style={styles.divider} />
        <Text style={styles.mainTitle}>🚚 CONDITIONS SPÉCIFIQUES TRANSPORTEURS</Text>

        {/* Transporteur Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Statut du transporteur</Text>
          <Text style={styles.paragraph}>
            Le transporteur est un <Text style={styles.bold}>professionnel ou indépendant</Text>, agissant <Text style={styles.bold}>en son nom propre</Text> et sous sa seule responsabilité.
          </Text>
          <Text style={styles.paragraph}>
            Il n'existe <Text style={styles.bold}>aucun lien de subordination</Text> entre Transporti et le transporteur.
          </Text>
        </View>

        {/* Transporteur Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Documents requis</Text>
          <Text style={styles.paragraph}>
            Pour utiliser la plateforme, le transporteur peut être amené à fournir :
          </Text>
          <Text style={styles.bullet}>• Carte d'Identité Nationale (CIN),</Text>
          <Text style={styles.bullet}>• Patente,</Text>
          <Text style={styles.bullet}>• Licence de transport (si applicable),</Text>
          <Text style={styles.bullet}>• Permis de conduire valide.</Text>
          <Text style={styles.paragraph}>
            Transporti ne garantit pas la vérification exhaustive de ces documents.
          </Text>
        </View>

        {/* Transporteur Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Responsabilité</Text>
          <Text style={styles.paragraph}>
            Le transporteur est <Text style={styles.bold}>entièrement responsable</Text> :
          </Text>
          <Text style={styles.bullet}>• des marchandises transportées,</Text>
          <Text style={styles.bullet}>• du respect des lois et règlements applicables,</Text>
          <Text style={styles.bullet}>• des dommages, pertes ou retards.</Text>
          <Text style={styles.paragraph}>
            Transporti <Text style={styles.bold}>ne fournit aucune assurance</Text>.
          </Text>
        </View>

        {/* Transporteur Section 4 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Fraude et sanctions</Text>
          <Text style={styles.paragraph}>
            En cas de fraude, fausse déclaration ou comportement abusif, Transporti peut :
          </Text>
          <Text style={styles.bullet}>• suspendre,</Text>
          <Text style={styles.bullet}>• ou supprimer définitivement le compte transporteur.</Text>
        </View>

        {/* Expéditeurs */}
        <View style={styles.divider} />
        <Text style={styles.mainTitle}>📦 CONDITIONS SPÉCIFIQUES EXPÉDITEURS</Text>

        {/* Expéditeur Section 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Nature des marchandises</Text>
          <Text style={styles.paragraph}>
            Il est strictement interdit d'utiliser Transporti pour le transport de :
          </Text>
          <Text style={styles.bullet}>• drogues ou substances illicites,</Text>
          <Text style={styles.bullet}>• objets dangereux ou tranchants,</Text>
          <Text style={styles.bullet}>• marchandises illégales,</Text>
          <Text style={styles.bullet}>• produits périssables.</Text>
          <Text style={styles.paragraph}>
            Pour les biens neufs, l'expéditeur est <Text style={styles.bold}>fortement encouragé à fournir une facture</Text>.
          </Text>
        </View>

        {/* Expéditeur Section 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Responsabilité de l'expéditeur</Text>
          <Text style={styles.paragraph}>L'expéditeur est responsable :</Text>
          <Text style={styles.bullet}>• de l'exactitude des informations fournies,</Text>
          <Text style={styles.bullet}>• de l'emballage des marchandises,</Text>
          <Text style={styles.bullet}>• de la légalité des biens transportés.</Text>
        </View>

        {/* Expéditeur Section 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Absence de garantie</Text>
          <Text style={styles.paragraph}>
            Transporti ne garantit <Text style={styles.bold}>ni la livraison</Text>, <Text style={styles.bold}>ni le prix</Text>, <Text style={styles.bold}>ni la disponibilité</Text> des transporteurs.
          </Text>
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
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
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
  highlight: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 22,
    marginTop: 8,
    padding: 12,
    backgroundColor: '#FFF9E6',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFB800',
  },
  divider: {
    height: 2,
    backgroundColor: '#E9E9E9',
    marginVertical: 32,
  },
  footer: {
    height: 20,
  },
});

export default TermsAndConditionsScreen;
