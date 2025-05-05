import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import StyledText from '../../components/common/StyledText';
import COLORS from '../../constants/colors';

type Props = {
  placeholder: string;
  error: Error | null;
  refetch?: () => void;
};

const ErrorScreen = (props: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.centerContainer}>
        <StyledText style={styles.errorText}>
          {props.placeholder}: {props.error?.message || 'Data tidak ditemukan.'}
        </StyledText>
        {props.refetch !== undefined && (
          <TouchableOpacity
            onPress={() => props.refetch?.()}
            style={styles.retryButton}>
            <StyledText style={styles.retryButtonText}>Coba Lagi</StyledText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: COLORS.white,
    fontFamily: 'Roboto-Medium',
  },
});

export default ErrorScreen;
