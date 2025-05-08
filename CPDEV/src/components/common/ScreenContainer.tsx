import React, {ReactNode} from 'react';
import {ViewStyle} from 'react-native';
import {SafeAreaView, Edge} from 'react-native-safe-area-context';
import {GLOBAL_STYLE} from '../../theme/global';

interface ScreenContainerProps {
  children: ReactNode;
  edges?: Edge[];
  style?: ViewStyle;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['bottom', 'left', 'right'],
  style,
}) => {
  return (
    <SafeAreaView style={[GLOBAL_STYLE.container, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
};

export default ScreenContainer;
