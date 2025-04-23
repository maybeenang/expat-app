import {IconName} from '../components/common/CustomPhosporIcon';
import {MainTabParamList} from '../navigation/types';

export const getTabBarIconName = (routeName: keyof MainTabParamList) => {
  let iconName: IconName;
  switch (routeName) {
    case 'Explore':
      iconName = 'Compass';
      break;
    case 'Blog':
      iconName = 'Newspaper';
      break;
    case 'Event':
      iconName = 'Ticket';
      break;
    case 'Gallery':
      iconName = 'Images';
      break;
    case 'AccountStack':
      iconName = 'UserCircle';
      break;
    default:
      iconName = 'Warning';
  }

  return iconName;
};
