import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import { Carrier, inviteCarrier } from '../../../services/shipment.service';

interface TransporterProfileScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * M2: Transporter Profile Screen
 * Shows detailed profile of a transporter
 */
const TransporterProfileScreen: React.FC<TransporterProfileScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const carrier: Carrier = initialData?.transporter;
  const shipmentId = initialData?.shipmentId;
  const shipmentStatus = initialData?.shipmentStatus;
  const [isInviting, setIsInviting] = useState(false);

  // Contact info is visible only after both parties agreed (CONFIRMED, IN_TRANSIT, or DELIVERED)
  const showContactInfo = shipmentStatus && ['CONFIRMED', 'IN_TRANSIT', 'DELIVERED'].includes(shipmentStatus);

  if (!carrier) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => onNavigate?.('suggestedTransporters')}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Transporteur</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transporteur introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleInvite = async () => {
    if (!shipmentId) {
      Alert.alert('Erreur', 'ID d\'expédition manquant');
      return;
    }

    setIsInviting(true);
    try {
      const result = await inviteCarrier(shipmentId, carrier.id);
      
      if (result.success) {
        // Navigate to confirmation screen
        onNavigate?.('invitationSent', { transporter: carrier, shipmentId });
      } else {
        Alert.alert('Erreur', result.error || 'Échec de l\'invitation');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur s\'est produite lors de l\'invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleViewReviews = () => {
    // TODO: Navigate to reviews screen
    console.log('View reviews for transporter:', carrier.id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('suggestedTransporters')}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {carrier.firstName} {carrier.lastName}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {carrier.firstName[0]}{carrier.lastName[0]}
              </Text>
            </View>
            {carrier.verified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
              </View>
            )}
          </View>

          <Text style={styles.profileName}>
            {carrier.firstName} {carrier.lastName}
          </Text>

          {carrier.verified && (
            <Badge status="success" text="Identité vérifiée" />
          )}
        </View>

        {/* Contact Info Card - Only shown after matching is confirmed */}
        {showContactInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informations de contact</Text>
            <Card style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{carrier.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Téléphone:</Text>
                <Text style={styles.infoValue}>{carrier.phone}</Text>
              </View>
            </Card>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button onPress={handleInvite} disabled={isInviting}>
          {isInviting ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Envoi en cours...</Text>
            </View>
          ) : (
            <Text style={styles.primaryButtonText}>Inviter ce transporteur</Text>
          )}
        </Button>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewReviews}
          activeOpacity={0.7}
        >
          <Text style={styles.secondaryButtonText}>Voir ses avis</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444444',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 180,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1464F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2E8B57',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginVertical: 4,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 4,
  },
  ratingDivider: {
    fontSize: 14,
    color: '#666666',
    marginHorizontal: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 16,
  },
  infoCard: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
  },
  infoValue: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  bottomSpacer: {
    height: 20,
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
    paddingBottom: 34,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default TransporterProfileScreen;
