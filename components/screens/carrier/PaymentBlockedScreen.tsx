import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';

interface PaymentBlockedScreenProps {
  route?: { params?: { missionId?: string; shipmentId?: string; amount?: number } };
  onNavigate?: (screen: string, params?: any) => void;
}

const PaymentBlockedScreen: React.FC<PaymentBlockedScreenProps> = ({
  route,
  onNavigate,
}) => {
  const missionId = route?.params?.missionId || '#12345';
  const amount = route?.params?.amount || 45;
  const supportTicket = `SUP${Math.floor(Math.random() * 1000)}`;

  const handleCallSupport = () => {
    const phoneNumber = '+21671123456';
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application téléphone');
    });
  };

  const handleChatSupport = () => {
    // In a real app, this would open a chat interface
    Alert.alert('Chat Support', 'Le chat support sera disponible prochainement');
  };

  const handleBackToMissions = () => {
    if (onNavigate) {
      onNavigate('activeMissions');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blocked Icon */}
        <View style={styles.blockedIconContainer}>
          <View style={styles.blockedCircle}>
            <Text style={styles.blockedIcon}>⛔</Text>
          </View>
        </View>

        {/* Error Message */}
        <Text style={styles.errorTitle}>Code bloqué</Text>
        <Text style={styles.errorSubtitle}>
          Vous avez atteint le nombre maximum de tentatives (3/3).
        </Text>

        {/* Order Summary Card */}
        <Card style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Commande {missionId}</Text>
            <Text style={styles.orderAmount}>{amount} DT</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Badge text="VÉRIFICATION ÉCHOUÉE" variant="error" />
          </View>
        </Card>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Contactez le support</Text>
          
          {/* Phone Support Card */}
          <TouchableOpacity onPress={handleCallSupport}>
            <Card style={styles.supportCard}>
              <View style={styles.supportCardContent}>
                <View style={styles.supportIconCircle}>
                  <Text style={styles.phoneIcon}>📞</Text>
                </View>
                <View style={styles.supportInfo}>
                  <Text style={styles.supportName}>Support Transporti</Text>
                  <Text style={styles.supportDetail}>+216 71 123 456</Text>
                </View>
              </View>
              <Button
                onPress={handleCallSupport}
                variant="secondary"
                size="sm"
              >
                Appeler
              </Button>
            </Card>
          </TouchableOpacity>

          {/* Chat Support Card */}
          <TouchableOpacity onPress={handleChatSupport}>
            <Card style={styles.supportCard}>
              <View style={styles.supportCardContent}>
                <View style={styles.supportIconCircle}>
                  <Text style={styles.chatIcon}>💬</Text>
                </View>
                <View style={styles.supportInfo}>
                  <Text style={styles.supportName}>Chat support</Text>
                  <Text style={styles.supportDetail}>En ligne</Text>
                </View>
              </View>
              <Button
                onPress={handleChatSupport}
                variant="secondary"
                size="sm"
              >
                Chat
              </Button>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Ticket Information */}
        <View style={styles.ticketBanner}>
          <Text style={styles.ticketTitle}>
            Ticket de support créé : {supportTicket}
          </Text>
          <Text style={styles.ticketSubtitle}>
            Un agent vous contactera sous 15 minutes
          </Text>
        </View>

        {/* Back Button */}
        <Button
          onPress={handleBackToMissions}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Retour aux missions
        </Button>
      </ScrollView>
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
    alignItems: 'center',
    paddingBottom: 40,
  },
  blockedIconContainer: {
    marginTop: 40,
    marginBottom: 24,
  },
  blockedCircle: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockedIcon: {
    fontSize: 80,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  orderCard: {
    width: '100%',
    backgroundColor: '#FCE4E4',
    borderColor: 'rgba(217, 45, 32, 0.2)',
    borderWidth: 1,
    marginBottom: 32,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  badgeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  supportSection: {
    width: '100%',
    marginBottom: 24,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444444',
    marginBottom: 16,
  },
  supportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  supportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  supportIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  phoneIcon: {
    fontSize: 20,
  },
  chatIcon: {
    fontSize: 20,
  },
  supportInfo: {
    flex: 1,
  },
  supportName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  supportDetail: {
    fontSize: 12,
    color: '#666666',
  },
  ticketBanner: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  ticketTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#444444',
    marginBottom: 4,
  },
  ticketSubtitle: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
});

export default PaymentBlockedScreen;
