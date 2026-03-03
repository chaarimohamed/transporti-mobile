import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';

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
          <Text style={styles.logoIcon}>🚚</Text>
        </View>
        <Text style={styles.title}>Bienvenue sur Transporti</Text>
        <Text style={styles.subtitle}>Choisissez votre profil pour continuer</Text>
      </View>

      <View style={styles.cards}>
        <TouchableOpacity onPress={() => handleRoleSelection('sender')} activeOpacity={0.9}>
          <Card style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>📦</Text>
            </View>
            <Text style={styles.roleTitle}>Expéditeur</Text>
            <Text style={styles.roleDescription}>
              Envoyez vos colis en toute sécurité avec nos transporteurs vérifiés
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleRoleSelection('carrier')} activeOpacity={0.9}>
          <Card style={styles.roleCard}>
            <View style={styles.roleIcon}>
              <Text style={styles.roleEmoji}>🚛</Text>
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
    backgroundColor: '#fff',
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
    width: 80,
    height: 80,
    backgroundColor: '#1464F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  cards: {
    gap: 16,
  },
  roleCard: {
    alignItems: 'center',
    padding: 24,
  },
  roleIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#F0F7FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleEmoji: {
    fontSize: 40,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  link: {
    color: '#1464F6',
    fontSize: 14,
    fontWeight: '600',
  },
});
