import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';
import { BrandLogo } from '../../ui/BrandLogo';

interface SplashScreenProps {
  onNavigate: (screen: string) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  useEffect(() => {
    const timer = setTimeout(() => onNavigate('roleSelection'), 2000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <BrandLogo width={380} height={190} style={styles.logo} />
        <Text style={styles.tagline}>Connectez. Transportez. Gagnez.</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    marginBottom: 28,
    ...Shadows.primaryGlow,
  },
  tagline: {
    fontFamily: Fonts.regular,
    color: Colors.primaryLight,
    fontSize: FontSizes.sm,
    letterSpacing: 0.5,
    opacity: 0.85,
  },
  footer: {
    flexDirection: 'row',
    gap: 6,
    paddingBottom: 48,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.navyMid,
  },
  dotActive: {
    width: 18,
    backgroundColor: Colors.primary,
  },
});
