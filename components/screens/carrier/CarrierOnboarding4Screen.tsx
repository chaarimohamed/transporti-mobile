import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Colors, Fonts, FontSizes, Spacing } from '../../../theme';
import { AppIcon } from '../../ui/Icon';
import { Button } from '../../ui/Button';
import { updateProfile, uploadDocuments } from '../../../services/authService';

interface CarrierOnboarding4ScreenProps {
  onNavigate?: (screen: string, params?: any) => void;
  initialData?: {
    volume?: string;
    palette?: boolean;
    refrigere?: boolean;
    [key: string]: any;
  };
}

const CarrierOnboarding4Screen: React.FC<CarrierOnboarding4ScreenProps> = ({
  onNavigate,
  initialData,
}) => {
  const scaleAnim = new Animated.Value(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = async () => {
    try {
      setIsSaving(true);

      // 1. Save vehicle size collected on Onboarding2
      if (initialData?.volume) {
        await updateProfile({ vehicleSize: initialData.volume }).catch(() => {});
      }

      // 2. Upload encrypted identity documents collected on Onboarding3
      const docs = initialData?.documents as { cinBase64?: string; permisBase64?: string } | undefined;
      if (docs?.cinBase64 || docs?.permisBase64) {
        await uploadDocuments({
          cinBase64: docs.cinBase64,
          permisBase64: docs.permisBase64,
        }).catch(() => {}); // non-blocking — user can still proceed
      }
    } finally {
      setIsSaving(false);
    }
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
            <AppIcon name="check-circle" size={48} color={Colors.surface} />
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
            <View style={{ marginRight: 16 }}><AppIcon name="truck" size={24} color={Colors.primary} /></View>
            <Text style={styles.featureText}>Trouvez des missions près de vous</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={{ marginRight: 16 }}><AppIcon name="wallet" size={24} color={Colors.primary} /></View>
            <Text style={styles.featureText}>Gagnez de l'argent en livrant</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={{ marginRight: 16 }}><AppIcon name="star" size={24} color={Colors.primary} /></View>
            <Text style={styles.featureText}>Construisez votre réputation</Text>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleStart}
            size="lg"
            fullWidth
            loading={isSaving}
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
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
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
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 48,
    maxWidth: 320,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 32,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm + 4,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
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
    paddingVertical: Spacing.sm + 4,
  },
  featureText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.charcoal,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
  },
});

export default CarrierOnboarding4Screen;
