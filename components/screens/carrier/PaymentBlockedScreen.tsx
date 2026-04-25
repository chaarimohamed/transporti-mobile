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
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
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
            <AppIcon name="blocked-ban" size={80} color={Colors.error} />
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
                  <AppIcon name="phone" size={20} color={Colors.primary} />
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
                  <AppIcon name="chat" size={20} color={Colors.primary} />
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
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
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
  errorTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xl,
    color: Colors.error,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  orderCard: {
    width: '100%',
    backgroundColor: 'rgba(217, 45, 32, 0.08)',
    borderColor: 'rgba(217, 45, 32, 0.2)',
    borderWidth: 1,
    marginBottom: 32,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  orderAmount: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    color: Colors.textPrimary,
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
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.charcoal,
    marginBottom: Spacing.md,
  },
  supportCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm + 4,
    padding: Spacing.md,
  },
  supportCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm + 4,
  },
  supportIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm + 4,
  },
  supportInfo: {
    flex: 1,
  },
  supportName: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  supportDetail: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  ticketBanner: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 24,
  },
  ticketTitle: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    color: Colors.charcoal,
    marginBottom: 4,
  },
  ticketSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});

export default PaymentBlockedScreen;
