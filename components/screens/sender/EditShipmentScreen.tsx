import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Card } from '../../ui/Card';
import ShipmentFormatIcon, { getShipmentFormatLabel } from '../../ui/ShipmentFormatIcon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment } from '../../../services/shipment.service';

interface EditShipmentScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: { shipment: Shipment };
}

const FORMAT_OPTIONS = [
  { key: 'S', label: 'Petit colis', sub: 'Enveloppe / Sac' },
  { key: 'M', label: 'Colis moyen', sub: 'Carton / Valise' },
  { key: 'L', label: 'Grand colis', sub: 'Meuble / Électroménager' },
  { key: 'XL', label: 'Très grand', sub: 'Déménagement / Palette' },
];

const EditShipmentScreen: React.FC<EditShipmentScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const shipment = initialData?.shipment;

  const [itemName, setItemName] = useState(shipment?.itemName || '');
  const [description, setDescription] = useState(shipment?.description || '');
  const [format, setFormat] = useState(shipment?.packageFormat || 'M');
  const [budget, setBudget] = useState(shipment?.budget?.toString() || '');
  const [senderName, setSenderName] = useState(shipment?.senderName || '');
  const [senderPhone, setSenderPhone] = useState(shipment?.senderPhone || '');
  const [recipientName, setRecipientName] = useState(shipment?.recipientName || '');
  const [recipientPhone, setRecipientPhone] = useState(shipment?.recipientPhone || '');
  const [pickupInstructions, setPickupInstructions] = useState(shipment?.pickupInstructions || '');
  const [deliveryInstructions, setDeliveryInstructions] = useState(shipment?.deliveryInstructions || '');
  const [helperCount, setHelperCount] = useState(shipment?.helperCount?.toString() || '0');
  const [deliveryHelperCount, setDeliveryHelperCount] = useState(shipment?.deliveryHelperCount?.toString() || '0');
  const [loading, setLoading] = useState(false);

  if (!shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Expédition introuvable</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData: any = {
        itemName: itemName || undefined,
        description: description || undefined,
        packageFormat: format,
        cargo: FORMAT_OPTIONS.find(f => f.key === format)?.label || shipment.cargo,
        budget: budget ? parseFloat(budget) : null,
        senderName: senderName || null,
        senderPhone: senderPhone || null,
        recipientName: recipientName || null,
        recipientPhone: recipientPhone || null,
        pickupInstructions: pickupInstructions || null,
        deliveryInstructions: deliveryInstructions || null,
        helperCount: parseInt(helperCount) || 0,
        deliveryHelperCount: parseInt(deliveryHelperCount) || 0,
      };

      const result = await shipmentService.updateShipment(shipment.id, updateData);

      if (result.success) {
        if (Platform.OS === 'web') {
          window.alert('Expédition mise à jour avec succès !');
        } else {
          Alert.alert('Succès', 'Expédition mise à jour avec succès !');
        }
        onNavigate?.('back');
      } else {
        const msg = result.error || 'Impossible de modifier';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Erreur', msg);
        }
      }
    } catch (err) {
      console.error('Error updating shipment:', err);
      if (Platform.OS === 'web') {
        window.alert('Erreur de connexion');
      } else {
        Alert.alert('Erreur', 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => onNavigate?.('back')}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier l'expédition</Text>
        <Text style={styles.refNumber}>{shipment.refNumber}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {/* Route (read-only) */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Itinéraire</Text>
            <View style={styles.routeDisplay}>
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.routeText}>{shipment.from}</Text>
              </View>
              <View style={styles.routeDivider} />
              <View style={styles.routeRow}>
                <View style={[styles.routeDot, { backgroundColor: Colors.error }]} />
                <Text style={styles.routeText}>{shipment.to}</Text>
              </View>
            </View>
            <Text style={styles.routeNote}>L'itinéraire ne peut pas être modifié. Supprimez et recréez l'expédition si besoin.</Text>
          </Card>

          {/* Package info */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Colis</Text>

            <Text style={styles.label}>Nom de l'article</Text>
            <TextInput
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
              placeholder="Ex: Canapé, Machine à laver..."
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Détails supplémentaires..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />

            <Text style={styles.label}>Format du colis</Text>
            <View style={styles.formatGrid}>
              {FORMAT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.formatOption,
                    format === opt.key && styles.formatOptionActive,
                  ]}
                  onPress={() => setFormat(opt.key)}
                >
                  <ShipmentFormatIcon format={opt.key} size={28} color={format === opt.key ? Colors.primary : '#999'} />
                  <Text style={[styles.formatLabel, format === opt.key && styles.formatLabelActive]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.formatSub}>{opt.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Budget */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Budget indicatif</Text>
            <View style={styles.budgetRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={budget}
                onChangeText={setBudget}
                placeholder="Ex: 90"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
              <Text style={styles.budgetUnit}>TND</Text>
            </View>
          </Card>

          {/* Contact info */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Contact à la collecte</Text>
            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={senderName}
              onChangeText={setSenderName}
              placeholder="Nom de la personne à contacter"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={senderPhone}
              onChangeText={setSenderPhone}
              placeholder="Numéro de téléphone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Instructions de collecte</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={pickupInstructions}
              onChangeText={setPickupInstructions}
              placeholder="Étage, code d'accès..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
            <Text style={styles.label}>Aide au chargement</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setHelperCount(String(Math.max(0, parseInt(helperCount) - 1)))}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{helperCount}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setHelperCount(String(parseInt(helperCount) + 1))}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.counterLabel}>personne(s)</Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Contact à la livraison</Text>
            <Text style={styles.label}>Nom du destinataire</Text>
            <TextInput
              style={styles.input}
              value={recipientName}
              onChangeText={setRecipientName}
              placeholder="Nom du destinataire"
              placeholderTextColor="#999"
            />
            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="Numéro de téléphone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            <Text style={styles.label}>Instructions de livraison</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={deliveryInstructions}
              onChangeText={setDeliveryInstructions}
              placeholder="Étage, code d'accès..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
            <Text style={styles.label}>Aide au déchargement</Text>
            <View style={styles.counterRow}>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setDeliveryHelperCount(String(Math.max(0, parseInt(deliveryHelperCount) - 1)))}
              >
                <Text style={styles.counterBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.counterValue}>{deliveryHelperCount}</Text>
              <TouchableOpacity
                style={styles.counterBtn}
                onPress={() => setDeliveryHelperCount(String(parseInt(deliveryHelperCount) + 1))}
              >
                <Text style={styles.counterBtnText}>+</Text>
              </TouchableOpacity>
              <Text style={styles.counterLabel}>personne(s)</Text>
            </View>
          </Card>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <AppIcon name="checkmark" size={18} color="#FFF" />
                <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FFF',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginLeft: 12,
  },
  refNumber: {
    fontSize: 13,
    color: '#999',
    fontFamily: Fonts.medium,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: Radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1A1A1A',
    backgroundColor: '#FFF',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  formatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  formatOption: {
    width: '47%' as any,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: Radius.md,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  formatOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF9F0',
  },
  formatLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 6,
  },
  formatLabelActive: {
    color: Colors.primary,
  },
  formatSub: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  budgetUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  counterBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    minWidth: 20,
    textAlign: 'center',
  },
  counterLabel: {
    fontSize: 13,
    color: '#666',
  },
  routeDisplay: {
    gap: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeDivider: {
    width: 2,
    height: 14,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
  },
  routeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  routeNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  bottomActions: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E9E9E9',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontFamily: Fonts.semiBold,
    color: '#FFF',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    color: Colors.error,
  },
});

export default EditShipmentScreen;
