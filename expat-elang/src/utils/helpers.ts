import {IconName} from '../components/common/CustomPhosporIcon';
import {MainTabParamList} from '../navigation/types';

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
    default:
      iconName = 'Warning';
  }

  return iconName;
};
