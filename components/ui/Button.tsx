import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

interface ButtonProps {
  onPress?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1464F6'} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#1464F6',
  },
  secondary: {
    backgroundColor: '#F5F5F5',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1464F6',
  },
  size_sm: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
    fontSize: 16,
  },
  text_primary: {
    color: '#fff',
  },
  text_secondary: {
    color: '#444444',
  },
  text_outline: {
    color: '#1464F6',
  },
});
