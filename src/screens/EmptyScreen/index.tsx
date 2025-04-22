import {Image, StyleSheet, View} from 'react-native';
import StyledText from '../../components/common/StyledText';
import COLORS from '../../constants/colors';

const EmptyScreen = () => {
  return (
    <View style={styles.centerContainer}>
      <Image source={require('../../assets/images/not-found-search.png')} />
      <StyledText style={styles.infoText}>Belum ada data</StyledText>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  infoText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EmptyScreen;
