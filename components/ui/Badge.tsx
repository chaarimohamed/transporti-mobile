import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  status?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info';
  text: string;
  style?: StyleProp<ViewStyle>;
}

const Badge: React.FC<BadgeProps> = ({ status, variant, text, style }) => {
  const getStyles = () => {
    switch (status || variant || 'neutral') {
      case 'success':
        return { backgroundColor: 'rgba(46, 139, 87, 0.1)', color: '#2E8B57' };
      case 'warning':
        return { backgroundColor: 'rgba(255, 179, 71, 0.1)', color: '#FFB347' };
      case 'error':
        return { backgroundColor: 'rgba(217, 45, 32, 0.1)', color: '#D92D20' };
      case 'neutral':
        return { backgroundColor: '#E9E9E9', color: '#666666' };
      case 'info':
        return { backgroundColor: 'rgba(20, 100, 246, 0.1)', color: '#1464F6' };
      default:
        return { backgroundColor: '#E9E9E9', color: '#666666' };
    }
  };

  const customStyles = getStyles();

  return (
    <View style={[styles.container, { backgroundColor: customStyles.backgroundColor }, style]}>
      <Text style={[styles.text, { color: customStyles.color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Badge;
