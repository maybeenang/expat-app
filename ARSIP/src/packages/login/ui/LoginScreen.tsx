import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import {TEXT_STYLES} from '../../../constants/TEXT_STYLES';
import {STYLES} from '../../../constants/STYLES';
import AppTextField from '../../../components/AppTextField';
import AppButton from '../../../components/AppButton';
import {login} from '../services/authService';
import IcLogoText from '../../../assets/icons/ic_logo_text.svg';
import Spinner from 'react-native-loading-spinner-overlay';
import {COLORS} from '../../../constants/COLORS';
import {useSnackbar} from '../../../components/SnackbarContext';

const LoginScreen = ({navigation}: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validInput, setValidInput] = useState(false);
  const {showSnackbar} = useSnackbar();

  useEffect(() => {
    setValidInput(username.trim().length > 0 && password.trim().length > 0);
  }, [username, password]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await login(username, password);
      setLoading(false);

      if (response && response.status === 200 && response.data) {
        navigation.replace('MainApp');
      } else {
        showSnackbar(response?.message ?? '', 'error');
      }
    } catch (error) {
      setLoading(false);
      showSnackbar(error.message ?? '', 'error');
      console.error('Login error:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.content}>
            <Spinner
              visible={loading}
              customIndicator={
                <View style={STYLES.spinnerContainer}>
                  <ActivityIndicator size="large" color={COLORS.blue} />
                </View>
              }
            />
            <IcLogoText height={24} />
            <Text style={[TEXT_STYLES.title, STYLES.mt40]}>Welcome Back</Text>
            <Text style={[TEXT_STYLES.subTitle, STYLES.mt4, STYLES.taCenter]}>
              Log in to your account and stay connected
            </Text>

            <View style={styles.cardContainer}>
              <AppTextField
                label="Username"
                placeholder="Masukkan username anda"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <AppTextField
                label="Password"
                placeholder="Masukkan password anda"
                autoCapitalize="none"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <View style={STYLES.mt24} />
              <AppButton title="Masuk" onPress={handleLogin} disabled={!validInput} />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white2,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 24,
    flex: 1,
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    marginTop: 32,
    paddingBottom: 28,
  },
});

export default LoginScreen;
