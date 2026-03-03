import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface ApplicationDetailsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * ApplicationDetailsScreen - View and manage a specific carrier application (GROUPE 2)
 * Shows shipment details and allows sender to accept or reject the carrier
 */
const ApplicationDetailsScreen: React.FC<ApplicationDetailsScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [shipment] = useState<Shipment | null>(initialData?.shipment || null);
  const [loading, setLoading] = useState(false);

  if (!shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>Expédition introuvable</Text>
          <Button onPress={() => onNavigate?.('applicationList')}>
            <Text style={styles.buttonText}>Retour</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const handleAcceptCarrier = async () => {
    const confirmMsg = 'Voulez-vous accepter ce transporteur pour cette expédition ?';
    
    const onConfirm = async () => {
      try {
        setLoading(true);
        const result = await shipmentService.acceptCarrier(shipment.id);

        if (result.success) {
          // Navigate to confirmation screen (M6)
          onNavigate?.('applicationAccepted', { shipment: result.shipment });
        } else {
          const errorMsg = result.error || 'Impossible d\'accepter le transporteur';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Erreur', errorMsg);
          }
        }
      } catch (err) {
        console.error('Error accepting carrier:', err);
        if (Platform.OS === 'web') {
          window.alert('Erreur de connexion');
        } else {
          Alert.alert('Erreur', 'Erreur de connexion');
        }
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Accepter le transporteur', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', style: 'default', onPress: onConfirm },
      ]);
    }
  };

  const handleRejectCarrier = async () => {
    const confirmMsg = 'Voulez-vous refuser ce transporteur ? L\'expédition redeviendra disponible.';
    
    const onConfirm = async () => {
      try {
        setLoading(true);
        const result = await shipmentService.rejectCarrier(shipment.id);

        if (result.success) {
          const successMsg = result.message || 'Transporteur refusé. L\'expédition est à nouveau disponible.';
          if (Platform.OS === 'web') {
            window.alert(successMsg);
            onNavigate?.('dashboard', { refresh: Date.now() });
          } else {
            Alert.alert('Succès', successMsg, [
              {
                text: 'OK',
                onPress: () => onNavigate?.('dashboard', { refresh: Date.now() }),
              },
            ]);
          }
        } else {
          const errorMsg = result.error || 'Impossible de refuser le transporteur';
          if (Platform.OS === 'web') {
            window.alert(errorMsg);
          } else {
            Alert.alert('Erreur', errorMsg);
          }
        }
      } catch (err) {
        console.error('Error rejecting carrier:', err);
        if (Platform.OS === 'web') {
          window.alert('Erreur de connexion');
        } else {
          Alert.alert('Erreur', 'Erreur de connexion');
        }
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        onConfirm();
      }
    } else {
      Alert.alert('Refuser le transporteur', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Refuser', style: 'destructive', onPress: onConfirm },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('applicationList')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidature</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Status Alert */}
        <Card style={styles.alertCard}>
          <View style={styles.alertContent}>
            <Text style={styles.alertIcon}>⏳</Text>
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Décision en attente</Text>
              <Text style={styles.alertText}>
                Un transporteur souhaite prendre cette expédition
              </Text>
            </View>
          </View>
        </Card>

        {/* Shipment Info */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Détails de l'expédition</Text>
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.refNumber}>{shipment.refNumber}</Text>
            <Badge status="warning" text="Demandé" />
          </View>

          <View style={styles.divider} />

          {/* Route */}
          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <View style={styles.pointDot}>
                <Text style={styles.pointIcon}>📍</Text>
              </View>
              <View style={styles.pointInfo}>
                <Text style={styles.pointLabel}>Départ</Text>
                <Text style={styles.pointValue}>{shipment.from}</Text>
              </View>
            </View>

            <View style={styles.routeLine} />

            <View style={styles.routePoint}>
              <View style={styles.pointDot}>
                <Text style={styles.pointIcon}>🎯</Text>
              </View>
              <View style={styles.pointInfo}>
                <Text style={styles.pointLabel}>Arrivée</Text>
                <Text style={styles.pointValue}>{shipment.to}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type de colis</Text>
              <Text style={styles.detailValue}>{shipment.cargo || 'Colis standard'}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Prix</Text>
              <Text style={styles.detailPrice}>{shipment.price} TND</Text>
            </View>
          </View>

          {shipment.description && (
            <>
              <View style={styles.divider} />
              <View style={styles.descriptionSection}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.descriptionText}>{shipment.description}</Text>
              </View>
            </>
          )}
        </Card>

        {/* Carrier Info (Placeholder - would need carrier details from API) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transporteur</Text>
        </View>

        <Card style={styles.carrierCard}>
          <View style={styles.carrierHeader}>
            <View style={styles.carrierAvatar}>
              <Text style={styles.carrierAvatarText}>👤</Text>
            </View>
            <View style={styles.carrierInfo}>
              <Text style={styles.carrierName}>Transporteur qualifié</Text>
              <Text style={styles.carrierMeta}>⭐ 4.8 (124 courses)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.carrierStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>124</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Note</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Succès</Text>
            </View>
          </View>
        </Card>

        {/* Actions Info */}
        <Card style={styles.infoBox}>
          <Text style={styles.infoBoxIcon}>ℹ️</Text>
          <Text style={styles.infoBoxText}>
            En acceptant, l'expédition sera confiée au transporteur et passera en transit.
            En refusant, elle redeviendra disponible pour d'autres transporteurs.
          </Text>
        </Card>
      </ScrollView>

      {/* Bottom Actions */}
      {loading ? (
        <View style={styles.bottomActions}>
          <ActivityIndicator size="small" color="#1464F6" />
          <Text style={styles.loadingText}>Traitement...</Text>
        </View>
      ) : (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={handleRejectCarrier}
            activeOpacity={0.7}
          >
            <Text style={styles.rejectButtonText}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={handleAcceptCarrier}
            activeOpacity={0.7}
          >
            <Text style={styles.acceptButtonText}>Accepter</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    paddingHorizontal: 20,
    paddingTop: 72,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  alertCard: {
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 16,
    marginBottom: 24,
  },
  alertContent: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 32,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#666666',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  infoCard: {
    padding: 16,
    marginBottom: 24,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  refNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },
  routeSection: {
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  pointDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointIcon: {
    fontSize: 20,
  },
  pointInfo: {
    flex: 1,
    paddingTop: 4,
  },
  pointLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },
  pointValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginLeft: 19,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  detailPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1464F6',
  },
  descriptionSection: {
    gap: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  carrierCard: {
    padding: 16,
    marginBottom: 24,
  },
  carrierHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  carrierAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  carrierAvatarText: {
    fontSize: 28,
  },
  carrierInfo: {
    flex: 1,
  },
  carrierName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  carrierMeta: {
    fontSize: 13,
    color: '#666666',
  },
  carrierStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1464F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999999',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
  },
  infoBox: {
    padding: 16,
    backgroundColor: '#F0F7FF',
    borderWidth: 1,
    borderColor: '#1464F6',
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoBoxIcon: {
    fontSize: 20,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    padding: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D92D20',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D92D20',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1464F6',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default ApplicationDetailsScreen;
