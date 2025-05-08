import {IconName} from '../components/common/CustomIcon';
import {BottomTabParamList} from '../navigation/types';

export const getTabBarIconName = (routeName: keyof BottomTabParamList) => {
  let iconName: IconName;
  switch (routeName) {
    case 'Home':
      iconName = 'House';
      break;
    // case 'Event':
    //   iconName = 'Ticket';
    //   break;
    // case 'Rental':
    //   iconName = 'Compass';
    //   break;
    // case 'Forum':
    //   iconName = 'ChatsTeardrop';
    //   break;
    // case 'AccountStack':
    //   iconName = 'UserCircle';
    //   break;
    // case 'Notification':
    //   iconName = 'Bell';
    //   break;
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
