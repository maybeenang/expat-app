import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { COLORS } from '../constants/COLORS';
import { TEXT_STYLES } from '../constants/TEXT_STYLES';
import IcEyeOn from '../assets/icons/ic_eye_on.svg';
import IcEyeOff from '../assets/icons/ic_eye_off.svg';
import IcSearch from '../assets/icons/ic_search.svg';

interface TextFieldProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  showSearchIcon?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const AppTextField: React.FC<TextFieldProps> = ({
  label,
  errorMessage,
  secureTextEntry,
  showSearchIcon,
  style,
  autoCapitalize = 'none', // Default to 'none'
  ...props
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={TEXT_STYLES.text16SemiBold}>{label}</Text>}

      <View
        style={[styles.inputContainer, showSearchIcon && styles.inputWithIcon]}>
        {showSearchIcon && (
          <View style={styles.iconContainer}>
            <IcSearch width={16} height={16} />
          </View>
        )}

        <TextInput
          style={[styles.input, style, TEXT_STYLES.text14]}
          placeholderTextColor={COLORS.text500}
          secureTextEntry={secureTextEntry && !passwordVisible}
          autoCapitalize={autoCapitalize}
          {...props}
        />

        {/* {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.iconContainer}>
            {passwordVisible ? <IcEyeOn width={16} height={16} /> : <IcEyeOff width={16} height={16} />}
          </TouchableOpacity>
        )} */}
      </View>

      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    marginTop: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  inputWithIcon: {
    paddingLeft: 40, // Extra padding when search icon is present
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.darkBlue,
  },
  iconContainer: {
    position: 'absolute',
    left: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default AppTextField;
