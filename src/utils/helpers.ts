import {MainTabParamList} from '../navigation/types';

export const getTabBarIconName = (
  routeName: keyof MainTabParamList,
  focused: boolean,
): string => {
  switch (routeName) {
    case 'Explore':
      return focused ? 'compass' : 'compass-outline';
    case 'Blog':
      return focused ? 'newspaper' : 'newspaper-outline';
    case 'Event':
      return focused ? 'calendar' : 'calendar-outline'; // Contoh ikon Event
    case 'Gallery':
      return focused ? 'images' : 'images-outline'; // Contoh ikon Gallery
    case 'AccountStack':
      return focused ? 'person-circle' : 'person-circle-outline';
    default:
      return 'ellipse-outline'; // Fallback icon
  }
};
