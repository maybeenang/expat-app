import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import COLORS from '../../../constants/colors';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import StyledText from '../../common/StyledText';

const CustomHeader = (props: NativeStackHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: 8 + insets.top,
        height: 64 + insets.top,
        gap: 8,
        padding: 8,
        backgroundColor: COLORS.white,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        {props.back ? (
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <CustomIcon name="ArrowLeft" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        ) : undefined}
      </View>

      {props.options.headerTitle ? (
        <View style={{flex: 1, alignItems: 'center'}}>
          {/* @ts-ignore */}
          {props.options.headerTitle?.()}
          {/* @ts-ignore */}
        </View>
      ) : null}

      {props.options.title ? (
        <View style={{flex: 1, alignItems: 'flex-start'}}>
          <StyledText
            style={[
              {
                fontSize: 20,
                color: props.options.headerTintColor,
              },
              props.options.headerTitleStyle,
            ]}>
            {props.options.title}
          </StyledText>
        </View>
      ) : null}

      {/* @ts-ignore */}
      {props.options.headerRight?.()}
    </View>
  );
};

export default CustomHeader;
