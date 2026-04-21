import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Fonts, FontSizes, Radius } from '../../theme';

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
        return { backgroundColor: Colors.successSurface, color: Colors.success };
      case 'warning':
        return { backgroundColor: Colors.warningSurface, color: Colors.warning };
      case 'error':
        return { backgroundColor: Colors.errorSurface, color: Colors.error };
      case 'info':
        return { backgroundColor: Colors.primarySurface, color: Colors.primaryDark };
      case 'neutral':
      default:
        return { backgroundColor: Colors.backgroundAlt, color: Colors.textSecondary };
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.xs,
    letterSpacing: 0.2,
  },
});

export default Badge;
