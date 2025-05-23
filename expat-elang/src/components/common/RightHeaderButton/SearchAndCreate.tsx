import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CustomIcon} from '../CustomPhosporIcon';
import COLORS from '../../../constants/colors';
import {
  NativeStackHeaderRightProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  DrawerParamList,
  MainTabParamList,
  RootStackParamList,
} from '../../../navigation/types';
import {useRedirectStore} from '../../../store/useRedirectStore';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

interface SearchAndCreateProps extends NativeStackHeaderRightProps {
  navigation: NativeStackNavigationProp<any, any>;
  isLoggedIn: boolean;
  searchScreen?: RootStackParamList | DrawerParamList | MainTabParamList;
  createScreen?: string;
}

const SearchAndCreate = ({
  navigation,
  isLoggedIn = false,
  searchScreen,
  createScreen,
}: SearchAndCreateProps) => {
  const {setRedirect} = useRedirectStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          if (!isLoggedIn) {
            setRedirect(createScreen as any);
            navigation.navigate('LoginV1', {
              params: {
                goto: createScreen,
              },
            });
            return;
          }
          navigation.navigate(createScreen as any);
        }}
        style={styles.centerContainerShort}>
        <CustomIcon name="Plus" size={25} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centerContainerShort: {
    alignItems: 'center',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SearchAndCreate;
