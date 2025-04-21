import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import StyledText from '../StyledText';
import COLORS from '../../../constants/colors';

interface StyledHeaderProps extends NativeStackHeaderProps {
  children?: ReactNode;
}

const StyledHeader: React.FC<StyledHeaderProps> = ({
  children,
  ...props
}: StyledHeaderProps) => {
  return (
    <View style={styles.continer}>
      <StyledText>{props.options?.title}</StyledText>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  continer: {
    flex: 1,
    backgroundColor: COLORS.white,
    height: 100,
    padding: 10,
  },
});

export default StyledHeader;
