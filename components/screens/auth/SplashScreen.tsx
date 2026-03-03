import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
        <View style={styles.logo}>
          <Text style={styles.logoIcon}>🚚</Text>
        </View>
        <Text style={styles.title}>Transporti.tn</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1464F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 96,
    height: 96,
    backgroundColor: '#fff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 48,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
});
