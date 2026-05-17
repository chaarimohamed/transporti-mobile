import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../../theme';
import { Card } from '../../ui/Card';
import { AppIcon } from '../../ui/Icon';
import * as shipmentService from '../../../services/shipment.service';
import { Shipment, ShipmentApplication } from '../../../services/shipment.service';

interface ApplicationDetailsScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: any;
}

/**
 * ApplicationDetailsScreen – TC-106
 * Sender views all carrier applications for a shipment and accepts/rejects them.
 */
const ApplicationDetailsScreen: React.FC<ApplicationDetailsScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const [shipment] = useState<Shipment | null>(initialData?.shipment || null);
  const returnScreen = initialData?.returnScreen || 'applicationList';
  const returnParams = initialData?.returnParams;
  const [applications, setApplications] = useState<ShipmentApplication[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [counterAppId, setCounterAppId] = useState<string | null>(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');

  const fetchApplications = useCallback(async () => {
    if (!shipment?.id) return;
    setLoadingApps(true);
    const result = await shipmentService.getShipmentApplications(shipment.id);
    if (result.success && result.applications) {
      setApplications(result.applications);
    }
    setLoadingApps(false);
  }, [shipment?.id]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  if (!shipment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <AppIcon name="alert-triangle" size={24} color={Colors.error} />
          <Text style={styles.errorText}>Expédition introuvable</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => onNavigate?.('back')}>
            <Text style={styles.backBtnText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleAccept = (app: ShipmentApplication) => {
    const confirmMsg = `Accepter la candidature de ${app.carrier?.firstName ?? 'ce transporteur'} pour ${app.proposedPrice} TND ?`;

    const doAccept = async () => {
      try {
        setActionLoading(app.id);
        const result = await shipmentService.acceptCarrier(shipment.id, app.id);
        if (result.success) {
          onNavigate?.('applicationAccepted', { shipment: result.shipment });
        } else {
          const msg = result.error || "Impossible d'accepter";
          if (Platform.OS === 'web') {
            window.alert(msg);
          } else {
            Alert.alert('Erreur', msg);
          }
        }
      } catch {
        Alert.alert('Erreur', 'Erreur de connexion');
      } finally {
        setActionLoading(null);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        doAccept();
      }
    } else {
      Alert.alert('Accepter', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Accepter', onPress: doAccept },
      ]);
    }
  };

  const handleReject = (app: ShipmentApplication) => {
    const confirmMsg = `Refuser la candidature de ${app.carrier?.firstName ?? 'ce transporteur'} ?`;

    const doReject = async () => {
      try {
        setActionLoading(app.id);
        const result = await shipmentService.rejectCarrier(shipment.id, app.id);
        if (result.success) {
          fetchApplications();
        } else {
          const msg = result.error || 'Impossible de refuser';
          if (Platform.OS === 'web') {
            window.alert(msg);
          } else {
            Alert.alert('Erreur', msg);
          }
        }
      } catch {
        Alert.alert('Erreur', 'Erreur de connexion');
      } finally {
        setActionLoading(null);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        doReject();
      }
    } else {
      Alert.alert('Refuser', confirmMsg, [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Refuser', style: 'destructive', onPress: doReject },
      ]);
    }
  };

  const handleCounter = async (app: ShipmentApplication) => {
    const price = parseFloat(counterPriceInput);
    if (!counterPriceInput || isNaN(price) || price <= 0) {
      Alert.alert('Prix invalide', 'Veuillez saisir un prix valide.');
      return;
    }

    try {
      setActionLoading(app.id);
      const result = await shipmentService.counterOffer(shipment!.id, app.id, price);
      if (result.success) {
        setCounterAppId(null);
        setCounterPriceInput('');
        fetchApplications();
        const msg = result.message || 'Contre-offre envoyée';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Succès', msg);
        }
      } else {
        const msg = result.error || 'Impossible d\'envoyer la contre-offre';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Erreur', msg);
        }
      }
    } catch {
      Alert.alert('Erreur', 'Erreur de connexion');
    } finally {
      setActionLoading(null);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return `⭐ ${rating.toFixed(1)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate?.('back')}
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={18} color={Colors.charcoal} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Candidatures</Text>
          <Text style={styles.headerSub}>{shipment.refNumber}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Route summary */}
        <Card style={styles.routeCard}>
          <View style={styles.routeRow}>
            <AppIcon name="map-pin" size={14} color={Colors.primary} />
            <Text style={styles.routeText} numberOfLines={1}>{shipment.from}</Text>
          </View>
          <View style={styles.routeArrow}>
            <View style={styles.routeLine} />
            <AppIcon name="chevron-down" size={12} color={Colors.textSecondary} />
          </View>
          <View style={styles.routeRow}>
            <AppIcon name="location-pin" size={14} color={Colors.accent} />
            <Text style={styles.routeText} numberOfLines={1}>{shipment.to}</Text>
          </View>
        </Card>

        {/* Sender budget hint */}
        {shipment.budget != null && (
          <Card style={styles.routeCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AppIcon name="wallet" size={14} color={Colors.textSecondary} />
              <Text style={{ fontSize: 13, color: Colors.textSecondary }}>Budget indicatif du client : </Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.charcoal }}>{shipment.budget} DT</Text>
            </View>
          </Card>
        )}

        {/* Applications list */}
        <Text style={styles.sectionTitle}>
          {loadingApps
            ? 'Chargement des candidatures\u2026'
            : `${applications.filter(a => a.status === 'PENDING' || a.status === 'COUNTER_OFFERED').length} candidature(s) en cours`}
        </Text>

        {loadingApps ? (
          <View style={styles.loadingApps}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : applications.filter(a => a.status === 'PENDING' || a.status === 'COUNTER_OFFERED').length === 0 ? (
          <Card style={styles.emptyCard}>
            <AppIcon name="info-circle" size={24} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>Aucune candidature en attente pour le moment</Text>
          </Card>
        ) : (
          applications
            .filter(a => a.status === 'PENDING' || a.status === 'COUNTER_OFFERED')
            .map(app => {
              const isActioning = actionLoading === app.id;
              const carrierName = app.carrier
                ? `${app.carrier.firstName} ${app.carrier.lastName}`
                : 'Transporteur';
              const initial = app.carrier?.firstName?.[0]?.toUpperCase() ?? 'T';
              return (
                <Card key={app.id} style={styles.applicationCard}>
                  <View style={styles.applicationHeader}>
                    <View style={styles.carrierAvatar}>
                      <Text style={styles.carrierAvatarText}>{initial}</Text>
                    </View>
                    <View style={styles.carrierInfo}>
                      <Text style={styles.carrierName}>{carrierName}</Text>
                      {app.carrier?.gouvernerat ? (
                        <Text style={styles.carrierMeta}>{app.carrier.gouvernerat}</Text>
                      ) : null}
                      {app.carrier?.averageRating ? (
                        <Text style={styles.carrierMeta}>
                          {renderStars(app.carrier.averageRating)}{' '}
                          {app.carrier.totalReviews != null
                            ? `(${app.carrier.totalReviews} avis)`
                            : ''}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceValue}>{app.proposedPrice}</Text>
                      <Text style={styles.priceLabel}>TND</Text>
                    </View>
                  </View>

                  {/* Negotiation status */}
                  {app.status === 'COUNTER_OFFERED' && app.counterPrice != null && (
                    <View style={styles.counterBadge}>
                      <AppIcon name="info-circle" size={14} color="#E67E22" />
                      <Text style={styles.counterBadgeText}>
                        Votre contre-offre : {app.counterPrice} DT — en attente de réponse
                      </Text>
                    </View>
                  )}

                  {/* Counter-offer input */}
                  {counterAppId === app.id && (
                    <View style={styles.counterInputRow}>
                      <TextInput
                        style={styles.counterInput}
                        value={counterPriceInput}
                        onChangeText={setCounterPriceInput}
                        keyboardType="numeric"
                        placeholder="Votre prix (DT)"
                        placeholderTextColor="#999"
                      />
                      <TouchableOpacity
                        style={styles.counterSendBtn}
                        onPress={() => handleCounter(app)}
                        disabled={isActioning}
                      >
                        {isActioning ? (
                          <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                          <Text style={styles.counterSendText}>Envoyer</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.counterCancelBtn}
                        onPress={() => { setCounterAppId(null); setCounterPriceInput(''); }}
                      >
                        <Text style={styles.counterCancelText}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Actions: only show for PENDING (ball is with sender) */}
                  {app.status === 'PENDING' && (
                    <View style={styles.applicationActions}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={isActioning || actionLoading !== null}
                        onPress={() => handleReject(app)}
                        style={[
                          styles.rejectBtn,
                          (isActioning || actionLoading !== null) && styles.btnDisabled,
                        ]}
                      >
                        {isActioning ? (
                          <ActivityIndicator size="small" color={Colors.error} />
                        ) : (
                          <Text style={styles.rejectBtnText}>Refuser</Text>
                        )}
                      </TouchableOpacity>
                      {/* Only allow counter-offer if no previous counter round */}
                      {app.counterPrice == null && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          disabled={isActioning || actionLoading !== null}
                          onPress={() => {
                            setCounterAppId(app.id);
                            setCounterPriceInput('');
                          }}
                          style={[
                            styles.counterBtn,
                            (isActioning || actionLoading !== null) && styles.btnDisabled,
                          ]}
                        >
                          <Text style={styles.counterBtnText}>Contre-offre</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        disabled={isActioning || actionLoading !== null}
                        onPress={() => handleAccept(app)}
                        style={[
                          styles.acceptBtn,
                          (isActioning || actionLoading !== null) && styles.btnDisabled,
                        ]}
                      >
                        {isActioning ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Text style={styles.acceptBtnText}>Accepter</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </Card>
              );
            })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  acceptBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    flex: 1,
    paddingVertical: 10,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  applicationActions: {
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
  },
  applicationCard: {
    marginBottom: 12,
    padding: 16,
  },
  applicationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  counterBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderColor: '#F0D0A0',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    padding: 10,
  },
  counterBadgeText: {
    color: '#E67E22',
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
  },
  counterBtn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E67E22',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  counterBtnText: {
    color: '#E67E22',
    fontSize: 13,
    fontWeight: '700',
  },
  counterCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  counterCancelText: {
    color: '#666',
    fontSize: 13,
  },
  counterInput: {
    borderColor: '#DDD',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  counterInputRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  counterSendBtn: {
    backgroundColor: '#E67E22',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  counterSendText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  carrierAvatar: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  carrierAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  carrierInfo: {
    flex: 1,
    gap: 2,
  },
  carrierMeta: {
    color: '#666666',
    fontSize: 12,
  },
  carrierName: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
  },
  container: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 12,
    padding: 32,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: '#666666',
    fontSize: 16,
    marginBottom: 24,
    marginTop: 12,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    width: 32,
  },
  headerSub: {
    color: '#666666',
    fontSize: 12,
    marginTop: 2,
  },
  headerTitle: {
    color: '#1A1A1A',
    fontSize: 20,
    fontWeight: '700',
  },
  loadingApps: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#666666',
    fontSize: 11,
  },
  priceValue: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  rejectBtn: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: Colors.error,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  rejectBtnText: {
    color: Colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
  routeArrow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingLeft: 4,
    paddingVertical: 2,
  },
  routeCard: {
    marginBottom: 16,
    padding: 14,
  },
  routeLine: {
    backgroundColor: Colors.textSecondary,
    height: 1,
    width: 16,
  },
  routeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  routeText: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    color: '#1A1A1A',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
});

export default ApplicationDetailsScreen;
