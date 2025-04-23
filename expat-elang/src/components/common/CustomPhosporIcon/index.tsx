import Check from 'phosphor-react-native/src/icons/Check';
import Question from 'phosphor-react-native/src/icons/Question';
import Warning from 'phosphor-react-native/src/icons/Warning';
import Bed from 'phosphor-react-native/src/icons/Bed';
import Buildings from 'phosphor-react-native/src/icons/Buildings';
import Bicycle from 'phosphor-react-native/src/icons/Bicycle';
import House from 'phosphor-react-native/src/icons/House';
import OfficeChair from 'phosphor-react-native/src/icons/OfficeChair';
import Square from 'phosphor-react-native/src/icons/Square';
import SquareSplitVertical from 'phosphor-react-native/src/icons/SquareSplitVertical';
import ThumbsUp from 'phosphor-react-native/src/icons/ThumbsUp';
import Warehouse from 'phosphor-react-native/src/icons/Warehouse';
import Compass from 'phosphor-react-native/src/icons/Compass';
import Newspaper from 'phosphor-react-native/src/icons/Newspaper';
import Images from 'phosphor-react-native/src/icons/Images';
import Ticket from 'phosphor-react-native/src/icons/Ticket';
import UserCircle from 'phosphor-react-native/src/icons/UserCircle';
import MagnifyingGlass from 'phosphor-react-native/src/icons/MagnifyingGlass';
import WhatsappLogo from 'phosphor-react-native/src/icons/WhatsappLogo';
import React, {FC} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface PhosphorIconProps {
  color?: string;
  mirrored?: boolean;
  size?: string | number;
  style?: StyleProp<ViewStyle>;
  weight?: IconWeight;
}

export const SupportedIconsList = {
  Check,
  Question,
  Warning,
  Bed,
  Buildings,
  Bicycle,
  House,
  OfficeChair,
  Square,
  SquareSplitVertical,
  ThumbsUp,
  Warehouse,
  Compass,
  Newspaper,
  Images,
  Ticket,
  UserCircle,
  MagnifyingGlass,
  WhatsappLogo,
} as const;

export type IconName = keyof typeof SupportedIconsList;

export const IconTypes = [
  'thin',
  'light',
  'regular',
  'bold',
  'fill',
  'duotone',
] as const;
export type IconType = (typeof IconTypes)[number];

export interface IconProps {
  color?: string;
  name: IconName;
  size?: number | string;
  style?: StyleProp<ViewStyle>;
  type?: IconType;
}

export const CustomIcon: FC<IconProps> = ({
  color,
  name,
  size = 20,
  style,
  type = 'regular',
}) => {
  try {
    if (!SupportedIconsList[name]) {
      console.error('[Design] Icon not found: ', name);
      return null;
    }

    return (
      <>
        {React.createElement(SupportedIconsList[name], {
          color,
          size,
          weight: type,
          style,
        })}
      </>
    );
  } catch (error) {
    console.error('[Design] Error rendering icon: ', error);
    return null;
  }
};
