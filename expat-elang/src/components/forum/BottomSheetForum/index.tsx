import React from 'react';
import StyledText from '../../common/StyledText';
import StyledButton from '../../common/StyledButton';
import COLORS from '../../../constants/colors';
import {UseMutationResult} from '@tanstack/react-query';
import {ActivityIndicator, Alert, StyleSheet, View} from 'react-native';
import {AxiosResponse} from 'axios';
import Icon from '@react-native-vector-icons/ionicons';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

interface BottomSheetForumProps {
  handleDismissModalPress: () => void;
  activeItem: any;
  mutateDeleteForum: UseMutationResult<
    AxiosResponse<any, any>,
    Error,
    string,
    unknown
  >;
  handleNavigateDetail: (
    id: string,
    screen: 'ForumDetail' | 'ForumUpdate',
  ) => void;
}

const BottomSheetForum = ({
  handleDismissModalPress,
  activeItem,
  mutateDeleteForum,
  handleNavigateDetail,
}: BottomSheetForumProps) => {
  const {hide, show} = useLoadingOverlayStore();

  if (!activeItem) {
    return null;
  }

  return (
    <>
      <StyledButton
        onPress={() => {
          handleDismissModalPress();
          if (!activeItem) {
            return;
          }
          handleNavigateDetail(activeItem.id, 'ForumDetail');
        }}>
        <StyledText style={styles.primary}>Detail</StyledText>
      </StyledButton>
      <StyledButton
        variant="secondary"
        onPress={() => {
          handleDismissModalPress();
          if (!activeItem) {
            return;
          }
          handleNavigateDetail(activeItem.id, 'ForumUpdate');
        }}>
        <StyledText style={styles.secondary}>Edit</StyledText>
      </StyledButton>
      <StyledButton
        variant="secondary"
        onPress={async () => {
          if (!activeItem) {
            handleDismissModalPress();
            return;
          }

          show();
          try {
            await mutateDeleteForum.mutateAsync(activeItem.id);
            Alert.alert('Berhasil menghapus forum');
          } catch (error) {
            Alert.alert('Gagal menghapus forum');
          } finally {
            hide();
            handleDismissModalPress();
          }
        }}>
        <StyledText style={styles.secondary}>Hapus</StyledText>
      </StyledButton>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  primary: {
    color: COLORS.white,
    fontSize: 16,
  },
  secondary: {
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default BottomSheetForum;
