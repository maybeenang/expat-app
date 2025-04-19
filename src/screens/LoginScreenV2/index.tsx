import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ImageBackground,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../constants/colors';
import StyledButton from '../../components/common/StyledButton';
import StyledText from '../../components/common/StyledText';

const { height } = Dimensions.get('window');


const LoginScreenV2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleLoginPress = () => {
        console.log('Login V2 Attempt:', { email, password });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={COLORS.primary}
                barStyle="light-content"
            />

            {/* Bagian Header Berwarna */}
            <ImageBackground style={styles.headerSection}
                source={require('../../assets/images/login-bg.png')}
            >
                <StyledText style={styles.headerTitle}>Masuk ke Akun Anda</StyledText>
                <StyledText style={styles.headerSubtitle}>Masukkan email dan password</StyledText>
            </ImageBackground>

            <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                    <StyledText style={styles.label}>Email</StyledText>
                    <TextInput
                        style={styles.input}
                        placeholder="Masukkan username anda"
                        placeholderTextColor={COLORS.greyDark}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <StyledText style={styles.label}>Password</StyledText>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.inputPassword]}
                            placeholder="Masukkan password anda"
                            placeholderTextColor={COLORS.greyDark}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={styles.eyeIcon}
                            activeOpacity={0.7}
                        >
                            <Icon
                                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                size={24}
                                color={COLORS.greyDark}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <StyledButton
                    onPress={handleLoginPress}
                    activeOpacity={0.8}
                >
                    <StyledText style={styles.loginButtonText} weight="medium">Masuk</StyledText>
                </StyledButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    headerSection: {
        height: height * 0.35,
        backgroundColor: COLORS.primary,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 50,
    },
    headerTitle: {
        fontFamily: 'Roboto-Bold',
        fontSize: 26, // Sedikit lebih besar mungkin?
        color: COLORS.white, // Teks putih
        textAlign: 'center',
        marginBottom: 10,
    },
    headerSubtitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        color: COLORS.white, // Teks putih
        textAlign: 'center',
    },
    // --- Form Section ---
    formSection: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 25,
        paddingTop: 40,
    },
    inputGroup: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
        color: COLORS.textPrimary, // Warna teks label di area putih
        marginBottom: 8,
    },
    input: {
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
        backgroundColor: COLORS.white,
        height: 55,
        borderRadius: 10,
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
    loginButton: {
        backgroundColor: COLORS.primary, // Warna tombol tetap sama
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30, // Jarak dari input password, sesuaikan
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonText: {
        fontSize: 16,
        color: COLORS.white,
    },
});

export default LoginScreenV2;
