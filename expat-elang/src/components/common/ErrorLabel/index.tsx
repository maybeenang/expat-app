import React from 'react';
import {StyleSheet, Text} from 'react-native';

interface ErrorLabelProps {
  error: any;
}

const ErrorLabel = ({error}: ErrorLabelProps) => {
  if (!error) {
    return null;
  }
  return <Text style={styles.errorLabel}>{error}</Text>;
};

const styles = StyleSheet.create({
  errorLabel: {
    color: 'red',
    fontSize: 12,
  },
});

export default ErrorLabel;
