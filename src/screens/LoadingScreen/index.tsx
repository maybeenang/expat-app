import {ActivityIndicator, StyleSheet, View} from 'react-native';
import COLORS from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const LoadingScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
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
