import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Button } from '../../ui/Button';

interface CarrierOnboarding4ScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const CarrierOnboarding4Screen: React.FC<CarrierOnboarding4ScreenProps> = ({
  onNavigate,
}) => {
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = () => {
    onNavigate?.('dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
          <Text style={styles.progressText}>Étape 3 sur 3</Text>
        </View>

        {/* Success Icon */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.successCircle}>
            <Text style={styles.checkIcon}>✓</Text>
          </View>
        </Animated.View>

        {/* Success Message */}
        <View style={styles.messageContainer}>
          <Text style={styles.title}>C'est prêt !</Text>
          <Text style={styles.subtitle}>
            Vous pouvez maintenant accéder aux missions disponibles
          </Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🚚</Text>
            <Text style={styles.featureText}>Trouvez des missions près de vous</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>💰</Text>
            <Text style={styles.featureText}>Gagnez de l'argent en livrant</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⭐</Text>
            <Text style={styles.featureText}>Construisez votre réputation</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleStart}
            size="lg"
            fullWidth
          >
            Commencer
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    position: 'absolute',
    top: 32,
    left: 24,
    right: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E9E9E9',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1464F6',
  },
  progressText: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkIcon: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 48,
    maxWidth: 320,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresList: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 48,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 14,
    color: '#444444',
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
});

export default CarrierOnboarding4Screen;
