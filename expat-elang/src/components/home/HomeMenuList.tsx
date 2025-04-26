import {StyleSheet, TouchableOpacity, View} from 'react-native';
import StyledText from '../common/StyledText';
import COLORS from '../../constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import {CustomIcon} from '../common/CustomPhosporIcon';
import {IconName} from '../common/CustomPhosporIcon';
import {useNavigation} from '@react-navigation/native';

type MenuItemType = {
  id: string;
  label: string;
  icon: IconName;
  navigationType: 'drawer' | 'stack';
  screenName?:
    | never
    | 'Rental'
    | 'Event'
    | 'Restaurant'
    | 'Forum'
    | 'Blog'
    | 'Lawyers';
  params?: object;
};

const quickActions: MenuItemType[] = [
  {
    id: '1',
    label: 'Sewa Kamar',
    icon: 'Bed',
    navigationType: 'drawer',
    screenName: 'Rental',
    params: {
      category: {
        value: 'SHARED-ROOM',
        label: 'SHARED ROOM',
      },
    },
  },
  {
    id: '2',
    label: 'Sewa Kendaraan',
    icon: 'Car',
    navigationType: 'drawer',
    screenName: 'Rental',
    params: {
      category: {
        value: 'UNIT',
        label: 'UNIT',
      },
    },
  },
  {
    id: '3',
    label: 'Event Terdekat',
    icon: 'Ticket',
    navigationType: 'drawer',
    screenName: 'Event',
  },
  {
    id: '4',
    label: 'Restaurant',
    icon: 'ForkKnife',
    navigationType: 'drawer',
    screenName: 'Restaurant',
  },
  {
    id: '5',
    label: 'Forum',
    icon: 'ChatsTeardrop',
    navigationType: 'drawer',
    screenName: 'Forum',
  },
  {
    id: '6',
    label: 'Blog',
    icon: 'Newspaper',
    navigationType: 'drawer',
    screenName: 'Blog',
  },
  {
    id: '7',
    label: 'Lawyers',
    icon: 'Scales',
    navigationType: 'drawer',
    screenName: 'Lawyers',
  },
  {
    id: '8',
    label: 'Lainnya',
    icon: 'SquresFour',
    navigationType: 'drawer',
  },
];

interface HomeMenuItemProps {
  item: MenuItemType;
}

const HomeMenuItem = ({item}: HomeMenuItemProps) => {
  const navigation = useNavigation();

  const handleNavigation = () => {
    if (!item.screenName) {
      return;
    }
    try {
      navigation.navigate(item.screenName as never, item.params as never);
    } catch (error) {
      console.warn('Navigation error:', error);
    }
  };

  return (
    <TouchableOpacity
      style={styles.quickActionItem}
      activeOpacity={0.7}
      onPress={handleNavigation}>
      <View style={styles.quickActionIconCircle}>
        <CustomIcon
          name={item.icon}
          size={32}
          color={COLORS.primary}
          type="fill"
        />
      </View>
      <View style={styles.quickActionLabelWrapper}>
        <StyledText style={styles.quickActionLabel}>{item.label}</StyledText>
      </View>
    </TouchableOpacity>
  );
};

const HomeMenuList = () => {
  return (
    <View style={styles.quickActionsBackground}>
      <FlatList
        data={quickActions}
        renderItem={({item}) => <HomeMenuItem item={item} />}
        keyExtractor={item => item.id}
        numColumns={4}
        columnWrapperStyle={styles.quickActionRow}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionsBackground: {
    paddingTop: 20,
    backgroundColor: COLORS.neutralLight, // Warna abu muda (atau gradient)
  },
  quickActionRow: {
    justifyContent: 'space-around', // Sebar item merata
    marginBottom: 20,
  },
  quickActionItem: {
    alignItems: 'center',
    width: '25%', // Agar 4 kolom
  },
  quickActionIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 30,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // Shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionLabelWrapper: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  quickActionLabel: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default HomeMenuList;
