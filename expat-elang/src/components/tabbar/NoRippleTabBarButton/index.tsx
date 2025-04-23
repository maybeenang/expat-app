import {BottomTabBarButtonProps} from '@react-navigation/bottom-tabs';
import {Pressable, StyleSheet} from 'react-native';

const NoRippleTabBarButton: React.FC<BottomTabBarButtonProps> = ({
  children,
  onPress,
  accessibilityState,
  style,
  ...props
}) => {
  return (
    <Pressable
      {...props}
      onPress={onPress}
      android_ripple={{color: 'white', radius: 0}}
      style={[styles.tabBarButtonBase, style]}
      accessibilityState={accessibilityState} // Penting untuk accessibility
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tabBarButtonBase: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NoRippleTabBarButton;
