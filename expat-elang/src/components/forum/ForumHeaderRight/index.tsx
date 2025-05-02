import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import {useRedirectStore} from '../../../store/useRedirectStore';
import {useAuthStore} from '../../../store/useAuthStore';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import COLORS from '../../../constants/colors';

const ForumHeaderRight = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any, any>>();
  const {isLoggedIn} = useAuthStore();
  const {setRedirect} = useRedirectStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}} style={styles.centerContainerShort}>
        <CustomIcon name="Chat" size={25} color={COLORS.primary} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (!isLoggedIn) {
            setRedirect('ForumCreate' as any);
            navigation.navigate('LoginV1');
            return;
          }
          navigation.navigate('ForumCreate' as any);
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
    gap: 15,
    paddingHorizontal: 15,
  },
  centerContainerShort: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForumHeaderRight;
