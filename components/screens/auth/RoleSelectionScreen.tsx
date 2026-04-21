import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AppIcon } from '../../ui/Icon';
import { Colors, Fonts, FontSizes, Radius, Shadows } from '../../../theme';

interface RoleSelectionScreenProps {
  onNavigate: (screen: string) => void;
  onSelectRole?: (role: 'sender' | 'carrier') => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onNavigate, onSelectRole }) => {
  const handleRoleSelection = (role: 'sender' | 'carrier') => {
    if (onSelectRole) onSelectRole(role);
    if (role === 'sender') {
      onNavigate('senderRegister');
    } else {
      onNavigate('carrierRegister');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.logo}>
          <AppIcon name="truck" size={40} color={Colors.navy} />
        </View>
        <Text style={styles.title}>Bienvenue sur Transporti</Text>
        <Text style={styles.subtitle}>Choisissez votre profil pour continuer</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity onPress={() => handleRoleSelection('sender')} activeOpacity={0.88}>
          <Card style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <AppIcon name="package" size={36} color={Colors.primary} />
            </View>
            <Text style={styles.roleTitle}>Expéditeur</Text>
            <Text style={styles.roleDescription}>
              Envoyez vos colis en toute sécurité avec nos transporteurs vérifiés
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRoleSelection('carrier')} activeOpacity={0.88}>
          <Card style={styles.roleCard}>
            <View style={[styles.roleIcon, styles.roleIconCarrier]}>
              <AppIcon name="truck" size={36} color={Colors.accent} />
            </View>
            <Text style={styles.roleTitle}>Transporteur</Text>
            <Text style={styles.roleDescription}>
              Gagnez de l'argent en transportant des colis sur votre route
            </Text>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
        <TouchableOpacity onPress={() => onNavigate('login')}>
          <Text style={styles.link}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 88,
    height: 88,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Shadows.primaryGlow,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxl,
    color: Colors.navy,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cards: {
    gap: 16,
  },
  roleCard: {
    alignItems: 'center',
    padding: 28,
  },
  roleIcon: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primarySurface,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIconCarrier: {
    backgroundColor: 'rgba(245, 169, 98, 0.12)',
  },
  roleTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.md,
    color: Colors.charcoal,
    marginBottom: 8,
  },
  roleDescription: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  link: {
    fontFamily: Fonts.semiBold,
    color: Colors.primary,
    fontSize: FontSizes.sm,
  },
});
