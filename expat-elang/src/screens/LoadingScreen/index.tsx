import {ActivityIndicator, StyleSheet, View} from 'react-native';
import COLORS from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import StyledText from '../../components/common/StyledText';

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen = (props: LoadingScreenProps) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {props.text && (
        <StyledText style={{marginTop: 10}}>{props.text}</StyledText>
      )}
    </View>
  </SafeAreaView>
);

export const LoadingFooter = () => {
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color={COLORS.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  footerLoader: {
    paddingVertical: 20,
  },
});

export default LoadingScreen;
