import React from 'react';
import { Armchair, Briefcase } from 'phosphor-react-native';

import { Colors } from '../../theme';
import { AppIcon } from './Icon';

interface ShipmentFormatIconProps {
  color?: string;
  format?: string;
  size?: number;
}

export const getShipmentFormatLabel = (format?: string): string | null => {
  switch (format) {
    case 'S':
      return 'Petit colis';
    case 'M':
      return 'Sac / Valise';
    case 'L':
      return 'Meuble / Électroménager';
    case 'XL':
      return 'Déménagement';
    default:
      return format || null;
  }
};

const ShipmentFormatIcon: React.FC<ShipmentFormatIconProps> = ({
  color = Colors.textSecondary,
  format,
  size = 20,
}) => {
  switch (format) {
    case 'S':
      return <AppIcon name="package" size={size} color={color} />;
    case 'M':
      return <Briefcase size={size} color={color} weight="duotone" />;
    case 'L':
      return <Armchair size={size} color={color} weight="duotone" />;
    case 'XL':
      return <AppIcon name="truck" size={size} color={color} />;
    default:
      return <AppIcon name="package" size={size} color={color} />;
  }
};

export default ShipmentFormatIcon;