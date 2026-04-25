import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface BrandLogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  width = 220,
  height = 110,
  style,
}) => {
  return (
    <Image
      source={require('../../assets/branding/logo_transporti_removed_bg.png')}
      resizeMode="contain"
      style={[{ width, height }, style]}
    />
  );
};

export default BrandLogo;