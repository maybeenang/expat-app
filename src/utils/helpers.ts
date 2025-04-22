import {IconName} from '../components/common/CustomPhosporIcon';
import {MainTabParamList} from '../navigation/types';

export const getTabBarIconName = (
  routeName: keyof MainTabParamList,
): IconName => {
  switch (routeName) {
    case 'Explore':
      return 'Compass';
    case 'Blog':
      return 'Newspaper';
    case 'Event':
      return 'Ticket';
    case 'Gallery':
      return 'Images';
    case 'AccountStack':
      return 'UserCircle';
    default:
      return 'Square';
  }
};
