import {IconName} from '../components/common/CustomPhosporIcon';
import {MainTabParamList} from '../navigation/types';
// @ts-ignore
import qs from 'qs';

export const getTabBarIconName = (routeName: keyof MainTabParamList) => {
  let iconName: IconName;
  switch (routeName) {
    case 'Home':
      iconName = 'House';
      break;
    case 'Event':
      iconName = 'Ticket';
      break;
    case 'Rental':
      iconName = 'Compass';
      break;
    case 'Forum':
      iconName = 'ChatsTeardrop';
      break;
    case 'AccountStack':
      iconName = 'UserCircle';
      break;
    case 'Notification':
      iconName = 'Bell';
      break;
    default:
      iconName = 'Warning';
  }

  return iconName;
};

// function to capitalize first char string
export const capitalizeFirstChar = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const deleteEndLines = (str: string) => {
  if (!str) return '';
  return str.replace(/(\r\n|\n|\r)/gm, '');
};

export const qss = qs;
