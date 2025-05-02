import React, {useEffect} from 'react';
import StyledText from '../../common/StyledText';
import StyledButton from '../../common/StyledButton';
import COLORS from '../../../constants/colors';
import {UseMutationResult} from '@tanstack/react-query';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
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

  useEffect(() => {
    if (mutateDeleteForum.isPending) {
      show();
    } else {
      hide();
      if (mutateDeleteForum.isSuccess) {
        handleDismissModalPress();
      }
    }

    return () => {};
  }, [mutateDeleteForum, show, hide, handleDismissModalPress]);

  if (!activeItem) {
    return null;
  }

  //if (mutateDeleteForum.isPending) {
  //  return (
  //    <View style={styles.container}>
  //      <ActivityIndicator size="large" color={COLORS.primary} />
  //      <StyledText style={[styles.secondary, {textAlign: 'center'}]}>
  //        Menghapus...
  //      </StyledText>
  //    </View>
  //  );
  //}

  if (mutateDeleteForum.isError) {
    return (
      <>
        <StyledText style={styles.secondary}>Gagal menghapus</StyledText>

        <StyledButton
          variant="secondary"
          onPress={async () => {
            if (!activeItem) {
              return;
            }
            await mutateDeleteForum.mutateAsync(activeItem.id);
          }}>
          <StyledText style={styles.primary}>Coba lagi</StyledText>
        </StyledButton>
      </>
    );
  }

  //if (mutateDeleteForum.isSuccess) {
  //  return (
  //    <View style={styles.container}>
  //      <Icon
  //        name="checkmark-circle-outline"
  //        size={64}
  //        color={COLORS.primary}
  //        style={{marginBottom: 8}}
  //      />
  //      <StyledText style={[styles.secondary, {textAlign: 'center'}]}>
  //        Berhasil menghapus
  //      </StyledText>
  //    </View>
  //  );
  //}

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
            return;
          }
          await mutateDeleteForum.mutateAsync(activeItem.id);
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
