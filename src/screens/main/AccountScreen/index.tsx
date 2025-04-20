import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import StyledButton from '../../../components/common/StyledButton';
import StyledText from '../../../components/common/StyledText';
import {useAuthMutations} from '../../../hooks/useAuthMutations';

// Sesuaikan nama 'Account' jika berbeda di types.ts
type Props = NativeStackScreenProps<RootStackParamList, 'Account'>;

const AccountScreen = ({navigation}: Props) => {
  const {logout} = useAuthMutations();
  const handleLoginPress = () => {
    // Arahkan pengguna ke layar login yang sesuai
    // navigation.navigate('LoginV2'); // Asumsi LoginV2 adalah target
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <StyledText style={styles.title}>Masuk ke Akun Anda</StyledText>
        <StyledText style={styles.subTitle}>
          Login untuk menggunakan semua fitur
        </StyledText>

        <StyledButton onPress={handleLoginPress} activeOpacity={0.8}>
          <StyledText weight="medium" style={styles.loginButtonText}>
            Masuk
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
  subTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30, // Jarak ke tombol
  },
  loginButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
});

export default AccountScreen;
