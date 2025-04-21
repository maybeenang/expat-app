import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StyledText from '../../../../components/common/StyledText';
import COLORS from '../../../../constants/colors';
import StyledButton from '../../../../components/common/StyledButton';
import {useAuthMutations} from '../../../../hooks/useAuthMutations';

const LoggedInScreen = () => {
  const {logout, isLoading} = useAuthMutations();

  const handleLoginPress = () => {
    logout();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <View style={styles.container}>
          <StyledText style={styles.title}>Logging out...</StyledText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <StyledText style={styles.title}>Anda Sudah Masuk</StyledText>

        <StyledButton onPress={handleLoginPress} activeOpacity={0.8}>
          <StyledText weight="medium" style={styles.loginButtonText}>
            Logout
          </StyledText>
        </StyledButton>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 24,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },

  loginButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default LoggedInScreen;
