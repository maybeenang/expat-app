import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StyledText from '../../../../components/common/StyledText';
import COLORS from '../../../../constants/colors';
import StyledButton from '../../../../components/common/StyledButton';
import {useAuthMutations} from '../../../../hooks/useAuthMutations';
import {CustomIcon} from '../../../../components/common/CustomPhosporIcon';
import {useAuthStore} from '../../../../store/useAuthStore';
import {useShallow} from 'zustand/react/shallow';

const LoggedInScreen = () => {
  const {logout, isLoading} = useAuthMutations();
  const {userSession} = useAuthStore(
    useShallow(state => ({
      userSession: state.userSession,
    })),
  );

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
        <View style={styles.profileContainer}>
          <View>
            <CustomIcon name="UserCircle" size={64} type="thin" />
          </View>

          <StyledText style={styles.profileName} weight="bold">
            {userSession?.nama}
          </StyledText>
          <StyledText style={styles.profileEmail}>
            {userSession?.email}
          </StyledText>
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },

  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
  },
  profileEmail: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },

  loginButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default LoggedInScreen;
