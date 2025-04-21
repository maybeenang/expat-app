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
});

export default LoadingScreen;
