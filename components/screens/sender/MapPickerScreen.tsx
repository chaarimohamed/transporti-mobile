import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { Button } from '../../ui/Button';
import { GOOGLE_MAPS_API_KEY } from '../../../config/google.config';

interface MapPickerScreenProps {
  onNavigate?: (screen: string, data?: any) => void;
  initialData?: any;
  type?: 'pickup' | 'delivery';
}

const MapPickerScreen: React.FC<MapPickerScreenProps> = ({
  onNavigate,
  initialData,
  type = 'pickup',
}) => {
  const webViewRef = useRef<WebView>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'Nous avons besoin de votre permission pour accéder à votre position.',
          [{ text: 'OK' }]
        );
        // Default to Tunis
        setLocation({ latitude: 36.8065, longitude: 10.1815 });
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setLocation(coords);
      await reverseGeocode(coords.latitude, coords.longitude);
      setLoading(false);
    } catch (error) {
      console.error('Error getting location:', error);
      // Default to Tunis
      setLocation({ latitude: 36.8065, longitude: 10.1815 });
      setLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    setLoadingAddress(true);
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result && result.length > 0) {
        const addr = result[0];
        const formattedAddress = [
          addr.street,
          addr.streetNumber,
          addr.city,
          addr.postalCode,
          addr.region,
        ]
          .filter(Boolean)
          .join(', ');
        
        setAddress(formattedAddress || 'Adresse non trouvée');
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setAddress('Position sélectionnée');
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'locationSelected') {
        const { latitude, longitude } = data;
        setLocation({ latitude, longitude });
        await reverseGeocode(latitude, longitude);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  const handleConfirm = () => {
    if (!location) {
      Alert.alert('Erreur', 'Veuillez sélectionner une position sur la carte.');
      return;
    }

    const data = {
      ...initialData,
    };

    if (type === 'pickup') {
      data.pickupAddress = address;
      data.pickupCoordinates = {
        lat: location.latitude,
        lng: location.longitude,
      };
      onNavigate?.('addressPickup', data);
    } else {
      data.deliveryAddress = address;
      data.deliveryCoordinates = {
        lat: location.latitude,
        lng: location.longitude,
      };
      onNavigate?.('addressDelivery', data);
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { position: absolute; top: 0; bottom: 0; width: 100%; height: 100%; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const initialLat = ${location?.latitude || 36.8065};
        const initialLng = ${location?.longitude || 10.1815};
        
        const map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: initialLat, lng: initialLng },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        const marker = new google.maps.Marker({
          position: { lat: initialLat, lng: initialLng },
          map: map,
          draggable: true,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: Colors.primary,
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          }
        });

        // Handle marker drag end
        marker.addListener('dragend', function() {
          const position = marker.getPosition();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'locationSelected',
            latitude: position.lat(),
            longitude: position.lng()
          }));
        });

        // Handle map click
        map.addListener('click', function(e) {
          marker.setPosition(e.latLng);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'locationSelected',
            latitude: e.latLng.lat(),
            longitude: e.latLng.lng()
          }));
        });

        // Add locate me button
        const locationButton = document.createElement('button');
        locationButton.textContent = '📍';
        locationButton.style.cssText = 'background: white; border: none; padding: 10px 12px; margin: 10px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); cursor: pointer; font-size: 18px;';
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

        locationButton.addEventListener('click', function() {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              map.setCenter(pos);
              marker.setPosition(pos);
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'locationSelected',
                latitude: pos.lat,
                longitude: pos.lng
              }));
            });
          }
        });
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            onNavigate?.(type === 'pickup' ? 'addressPickup' : 'addressDelivery', initialData)
          }
          style={styles.backButton}
        >
          <AppIcon name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === 'pickup' ? 'Position de collecte' : 'Position de livraison'}
        </Text>
      </View>

      <View style={styles.addressCard}>
        {loadingAddress ? (
          <View style={styles.addressLoading}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.addressLoadingText}>Récupération de l'adresse...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.addressLabel}>Adresse sélectionnée</Text>
            <Text style={styles.addressText}>
              {address || 'Appuyez sur la carte pour sélectionner une position'}
            </Text>
          </>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      ) : (
        <View style={styles.mapContainer}>
          <WebView
            ref={webViewRef}
            source={{ html: htmlContent }}
            style={styles.webview}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            geolocationEnabled={true}
          />
        </View>
      )}

      <View style={styles.instructionsCard}>
        <Text style={styles.instructionsText}>
          Appuyez sur la carte ou déplacez le marqueur pour définir votre position exacte
        </Text>
      </View>

      <View style={styles.bottomActions}>
        <Button
          variant="outline"
          onPress={() =>
            onNavigate?.(type === 'pickup' ? 'addressPickup' : 'addressDelivery', initialData)
          }
          style={styles.cancelButton}
        >
          Annuler
        </Button>
        <Button
          onPress={handleConfirm}
          disabled={!location}
          style={styles.confirmButton}
        >
          Confirmer
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm + 4,
  },
  headerTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    color: Colors.textPrimary,
  },
  addressCard: {
    backgroundColor: Colors.backgroundAlt,
    marginHorizontal: 20,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm + 4,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addressLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  addressLoadingText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  addressLabel: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  addressText: {
    fontFamily: Fonts.medium,
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm + 4,
  },
  loadingText: {
    fontFamily: Fonts.regular,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: Spacing.sm + 4,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundAlt,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  instructionsCard: {
    backgroundColor: Colors.primarySurface,
    marginHorizontal: 20,
    marginTop: Spacing.sm + 4,
    marginBottom: Spacing.md,
    padding: Spacing.sm + 4,
    borderRadius: Spacing.sm,
  },
  instructionsText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    lineHeight: 18,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 24,
    gap: Spacing.sm + 4,
  },
  cancelButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
});

export default MapPickerScreen;
