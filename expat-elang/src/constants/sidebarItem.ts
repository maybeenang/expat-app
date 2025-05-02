import {IconName} from '../components/common/CustomPhosporIcon';
import COLORS from './colors';

export type DrawerItemType = 'drawer' | 'tab';

type DrawerItemProps = {
  label: string;
  icon: IconName;
  type: DrawerItemType;
  navigateTo?: any;
};

export const DRAWERICONOPTIONS = {
  size: 24,
  color: COLORS.primary,
};

export const drawerButtons: DrawerItemProps[] = [
  {
    label: 'Home',
    icon: 'House',
    type: 'tab',
    navigateTo: 'Home',
  },
  {
    label: 'Blog',
    icon: 'Newspaper',
    type: 'drawer',
    navigateTo: 'Blog',
  },
  {
    label: 'Rental',
    icon: 'Compass',
    type: 'tab',
    navigateTo: 'Rental',
  },
  {
    label: 'Forum',
    icon: 'Chat',
    type: 'tab',
    navigateTo: 'Forum',
  },

  {
    label: 'Gallery',
    icon: 'Images',
    type: 'drawer',
    navigateTo: 'Gallery',
  },

  {
    label: 'Event',
    icon: 'Ticket',
    type: 'tab',
    navigateTo: 'Event',
  },

  {
    label: 'Restaurant',
    icon: 'ForkKnife',
    type: 'drawer',
    navigateTo: 'Restaurant',
  },
  {
    label: 'Lawyers',
    icon: 'Scales',
    type: 'drawer',
    navigateTo: 'Lawyers',
  },
  {
    label: 'Jobs',
    icon: 'BriefCase',
    type: 'drawer',
    navigateTo: 'Jobs',
  },
];
