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
  ScrollView,
} from 'react-native';

import Icon from '@react-native-vector-icons/ionicons';

import COLORS from '../../constants/colors';
import StyledText from '../../components/common/StyledText';
import StyledButton from '../../components/common/StyledButton';
import {useAuthMutations} from '../../hooks/useAuthMutations';
import {useLoadingOverlayStore} from '../../store/useLoadingOverlayStore';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation/types';

interface RegisterScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'Register'> {}

const RegisterScreen = ({navigation}: RegisterScreenProps) => {
  const {show, hide} = useLoadingOverlayStore();

  const [fullName, setFullName] = useState('');
  const [mobilePhone, setMobilePhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {register, isRegistering, registrationError} = useAuthMutations();

  const isValid =
    fullName && mobilePhone && email && password && isRegistering === false;

  const handleRegisterPress = async () => {
    Keyboard.dismiss();
    if (!isValid) {
      return;
    }

    try {
      show();
      await register({
        full_name: fullName,
        mobile_phone: mobilePhone,
        email,
        password,
      });

      // Show success message and navigate to login
      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login with your credentials.',
        [
          {
            text: 'Login Now',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e: any) {
      console.log('Registration Error:', e);
      Alert.alert('Registration Failed', e.message);
    }

    hide();
  };

  const handleEyePress = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (registrationError) {
      console.log('Registration Error:', registrationError.message);
      Alert.alert('Registration Error', registrationError.message);
    }

    return () => {};
  }, [registrationError]);

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          {/* --- Header Teks --- */}
          <StyledText style={styles.mainTitle}>Create Your Account</StyledText>
          <StyledText style={styles.subTitle}>
            Join the expat community
          </StyledText>

          {/* --- Form Input --- */}
          <View style={styles.form}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={COLORS.greyDark}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            {/* Mobile Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your mobile number"
                placeholderTextColor={COLORS.greyDark}
                value={mobilePhone}
                onChangeText={setMobilePhone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Email Input */}
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.inputPassword]}
                  placeholder="Create a password"
                  placeholderTextColor={COLORS.greyDark}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />

                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={handleEyePress}
                  activeOpacity={0.7}>
                  <Icon
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={COLORS.greyDark}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <StyledButton
              onPress={handleRegisterPress}
              disabled={!isValid}
              style={[
                styles.registerButton,
                {
                  backgroundColor: isValid
                    ? COLORS.primary
                    : COLORS.primaryDisabled,
                },
              ]}
              activeOpacity={0.8}>
              <StyledText style={styles.registerButtonText} weight="medium">
                Register
              </StyledText>
            </StyledButton>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  inputPassword: {
    flex: 1,
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
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

export default RegisterScreen;

