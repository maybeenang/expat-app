import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Keyboard,
} from 'react-native';

import Icon from '@react-native-vector-icons/ionicons';

import COLORS from '../../constants/colors';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';
import {useAuthMutations} from '../../hooks/useAuthMutations';
import {useLoadingOverlayStore} from '../../store/useLoadingOverlayStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

interface ForgotPasswordScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'ForgotPassword'> {}

const ForgotPasswordScreen = ({navigation}: ForgotPasswordScreenProps) => {
  const {show, hide} = useLoadingOverlayStore();

  const [email, setEmail] = useState('');
  const {forgotPassword, isResettingPassword, forgotPasswordError} =
    useAuthMutations();

  const isValid = email && isResettingPassword === false;

  const handleResetPress = async () => {
    Keyboard.dismiss();
    if (!isValid) {
      return;
    }

    show();
    try {
      const response = await forgotPassword({email});
      if (!response) {
        throw new Error('Failed to send reset password instructions.');
      }

      // Reset email input
      console.log('Reset Password Success:', response.message);

      // delete h1 from message
      const msg = response.message.replace(/<h1>/g, '').replace(/<\/h1>/g, '');

      // Show success message
      Alert.alert('Reset Password', msg, [
        {
          text: 'Back to Login',
          onPress: () => navigation.navigate('LoginV1', {goto: undefined}),
        },
      ]);
    } catch (e: any) {
      console.log('Reset Password Error:', e);
      Alert.alert('Reset Password Failed', e.message);
    } finally {
      hide();
    }
  };

  useEffect(() => {
    if (forgotPasswordError) {
      console.log('Reset Password Error:', forgotPasswordError.message);
      Alert.alert('Reset Password Error', forgotPasswordError.message);
    }

    return () => {};
  }, [forgotPasswordError]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight() {
        return (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{padding: 10}}>
            <Icon name="close" size={32} color={COLORS.textPrimary} />
          </TouchableOpacity>
        );
      },
    });

    return () => {};
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />

      <View style={styles.container}>
        {/* --- Header Text --- */}
        <StyledText style={styles.mainTitle}>Forgot Password</StyledText>
        <StyledText style={styles.subTitle}>
          Enter your email to receive password reset instructions
        </StyledText>

        {/* --- Form Input --- */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={COLORS.greyDark}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <StyledButton
            onPress={handleResetPress}
            disabled={!isValid}
            style={[
              styles.resetButton,
              {
                backgroundColor: isValid
                  ? COLORS.primary
                  : COLORS.primaryDisabled,
              },
            ]}
            activeOpacity={0.8}>
            <StyledText style={styles.resetButtonText} weight="medium">
              Reset Password
            </StyledText>
          </StyledButton>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Remember your password?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginV1', {goto: undefined})}
              style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
    marginTop: 100,
  },
  mainTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    fontSize: 16,
    backgroundColor: COLORS.white,
    height: 55,
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    color: COLORS.textPrimary,
  },
  resetButton: {
    marginTop: 20,
  },
  resetButtonText: {
    fontSize: 16,
    color: COLORS.white,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginButton: {
    marginLeft: 5,
    padding: 5,
  },
  loginButtonText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
});

export default ForgotPasswordScreen;

