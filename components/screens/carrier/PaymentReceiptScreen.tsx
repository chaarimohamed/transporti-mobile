import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import Badge from '../../ui/Badge';
import { AppIcon } from '../../ui/Icon';

interface PaymentReceiptScreenProps {
  route?: { 
    params?: { 
      receiptNumber?: string;
      amount?: number;
      clientName?: string;
      clientPhone?: string;
      date?: string;
      missionId?: string;
      shipmentId?: string;
      carrierName?: string;
      vehiclePlate?: string;
      address?: string;
      paymentCode?: string;
      mission?: any;
    } 
  };
  onNavigate?: (screen: string, params?: any) => void;
}

const PaymentReceiptScreen: React.FC<PaymentReceiptScreenProps> = ({
  route,
  onNavigate,
}) => {
  const mission = route?.params?.mission;
  
  console.log('📄 Receipt mission data:', mission);
  
  const receiptNumber = route?.params?.receiptNumber || 'RCP123';
  const amount = mission?.price || route?.params?.amount || 45;
  const clientName = mission?.sender 
    ? `${mission.sender.firstName} ${mission.sender.lastName}`
    : route?.params?.clientName || 'Client';
  const clientPhone = mission?.sender?.phone || route?.params?.clientPhone || '+216 XX XXX XXX';
  const date = route?.params?.date || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const missionRefNumber = mission?.refNumber || route?.params?.missionId || '#12345';
  const carrierName = mission?.carrier
    ? `${mission.carrier.firstName} ${mission.carrier.lastName}`
    : route?.params?.carrierName || 'Transporteur';
  const vehiclePlate = mission?.carrier?.matricule || route?.params?.vehiclePlate || 'XXX XXXX';
  const address = mission?.to || route?.params?.address || 'Adresse non disponible';
  const paymentCode = route?.params?.paymentCode || '000000';

  const handleDownloadPDF = () => {
    Alert.alert(
      'Télécharger le reçu',
      'Le reçu sera téléchargé en format PDF',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Télécharger',
          onPress: () => {
            Alert.alert('Succès', 'Le reçu a été téléchargé');
          },
        },
      ]
    );
  };

  const handleShareByEmail = () => {
    Alert.alert(
      'Partager par email',
      'Le reçu sera envoyé par email',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Envoyer',
          onPress: () => {
            Alert.alert('Succès', 'Le reçu a été envoyé par email');
          },
        },
      ]
    );
  };

  const handleShare = () => {
    Alert.alert(
      'Partager',
      'Comment souhaitez-vous partager ce reçu ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Email', onPress: handleShareByEmail },
        { text: 'Télécharger', onPress: handleDownloadPDF },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => onNavigate?.('activeMissions')}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reçu de paiement</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShare}
        >
          <AppIcon name="upload" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Card */}
        <Card style={styles.receiptCard}>
          {/* Receipt Header */}
          <View style={styles.receiptHeaderBanner}>
            <Text style={styles.companyName}>TRANSPORTI.TN</Text>
            <Text style={styles.receiptTitle}>REÇU DE PAIEMENT</Text>
          </View>

          {/* Receipt Body */}
          <View style={styles.receiptBody}>
            {/* Receipt Number and Date */}
            <View style={styles.receiptMetaContainer}>
              <Text style={styles.receiptNumberText}>#{missionRefNumber}</Text>
              <Text style={styles.receiptDateText}>{date}</Text>
            </View>

            {/* Amount Paid */}
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Montant payé</Text>
              <Text style={styles.amountValue}>{amount.toFixed(2)} DT</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Méthode</Text>
              <Text style={styles.receiptValue}>Espèces</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Code utilisé</Text>
              <Text style={styles.receiptValue}>{paymentCode}</Text>
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <View style={styles.leftCircle} />
              <View style={styles.rightCircle} />
            </View>

            {/* Client Information */}
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Client</Text>
              <Text style={styles.receiptValueBold}>{clientName}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Téléphone</Text>
              <Text style={styles.receiptValue}>{clientPhone}</Text>
            </View>

            <View style={styles.spacer} />

            {/* Carrier Information */}
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Transporteur</Text>
              <Text style={styles.receiptValueBold}>{carrierName}</Text>
            </View>

            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Véhicule</Text>
              <Text style={styles.receiptValue}>{vehiclePlate}</Text>
            </View>

            {/* Separator */}
            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <View style={styles.leftCircle} />
              <View style={styles.rightCircle} />
            </View>

            {/* Delivery Address */}
            <View style={styles.addressSection}>
              <View style={styles.addressHeader}>
                <AppIcon name="package-box" size={18} color={Colors.primary} />
                <Text style={styles.addressLabel}>Livraison à :</Text>
              </View>
              <Text style={styles.addressValue}>{address}</Text>
            </View>

            {/* Status Badge */}
            <View style={styles.statusContainer}>
              <Badge text="LIVRÉ" variant="success" />
            </View>

            {/* QR Code Placeholder */}
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeBox}>
                <Text style={styles.qrCodePlaceholder}>QR</Text>
              </View>
              <Text style={styles.qrCodeLabel}>Scannez pour vérifier</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Action Buttons - Fixed at bottom */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleDownloadPDF}
          size="lg"
          fullWidth
        >
          Télécharger le reçu (PDF)
        </Button>
        <Button
          onPress={handleShareByEmail}
          variant="secondary"
          size="lg"
          fullWidth
        >
          Partager par email
        </Button>
      </View>
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
    paddingBottom: 16,
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
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 8,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  shareIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 140,
  },
  receiptCard: {
    overflow: 'hidden',
    padding: 0,
    borderRadius: 16,
  },
  receiptHeaderBanner: {
    backgroundColor: Colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 4,
  },
  receiptTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  receiptBody: {
    padding: 24,
  },
  receiptMetaContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  receiptNumberText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  receiptDateText: {
    fontSize: 12,
    color: '#666666',
  },
  amountSection: {
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  receiptLabel: {
    fontSize: 14,
    color: '#666666',
  },
  receiptValue: {
    fontSize: 14,
    color: '#1A1A1A',
    textAlign: 'right',
  },
  receiptValueBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'right',
  },
  separator: {
    position: 'relative',
    marginVertical: 16,
  },
  separatorLine: {
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    borderStyle: 'dashed',
  },
  leftCircle: {
    position: 'absolute',
    left: -24,
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  rightCircle: {
    position: 'absolute',
    right: -24,
    top: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.background,
  },
  spacer: {
    height: 8,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666666',
  },
  addressValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
    marginLeft: 24,
    lineHeight: 20,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  qrCodeContainer: {
    alignItems: 'center',
  },
  qrCodeBox: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: '#E9E9E9',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qrCodePlaceholder: {
    fontSize: 48,
    fontWeight: '700',
    color: '#E9E9E9',
  },
  qrCodeLabel: {
    fontSize: 12,
    color: '#666666',
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
    gap: 12,
  },
});

export default PaymentReceiptScreen;
