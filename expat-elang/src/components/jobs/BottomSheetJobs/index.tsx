import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {ProcessedJobItem} from '../../../types/jobs';
import COLORS from '../../../constants/colors';
import StyledButton from '../../common/StyledButton';
import StyledText from '../../common/StyledText';
import NUMBER from '../../../constants/number';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {useJobDeleteMutation} from '../../../hooks/useJobsQuery';

interface BottomSheetJobsProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  handleSheetChanges: (index: number) => void;
  selectedJob?: ProcessedJobItem | null;
  categoryId?: string;
}

const BottomSheetJobs = ({
  bottomSheetModalRef,
  handleSheetChanges,
  selectedJob,
  categoryId,
}: BottomSheetJobsProps) => {
  const {hide, show} = useLoadingOverlayStore();

  const deleteMutation = useJobDeleteMutation();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      onChange={handleSheetChanges}
      $modal={true}
      backdropComponent={props => (
        <BottomSheetBackdrop
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
          {...props}
        />
      )}>
      <BottomSheetView style={styles.bottomSheetContainer}>
        <StyledButton
          variant="primary"
          onPress={() => {
            if (!selectedJob) {
              return;
            }
            bottomSheetModalRef.current?.dismiss();
            navigation.navigate('JobDetail', {
              jobId: selectedJob.id,
              categoryId,
            });
          }}>
          <StyledText style={styles.primary}>Detail</StyledText>
        </StyledButton>
        <StyledButton
          variant="secondary"
          onPress={() => {
            if (!selectedJob) {
              return;
            }
            bottomSheetModalRef.current?.dismiss();
            navigation.navigate('JobUpdate', {
              jobId: selectedJob.id,
              categoryId,
            });
          }}>
          <StyledText style={styles.secondary}>Edit</StyledText>
        </StyledButton>
        <StyledButton
          variant="secondary"
          onPress={async () => {
            if (!selectedJob) {
              return;
            }
            show();
            try {
              await deleteMutation.mutateAsync(selectedJob.id);
            } catch (error) {
              console.error(error);
              Alert.alert(
                'Error',
                'Gagal menghapus pekerjaan. Silakan coba lagi.',
                [{text: 'OK'}],
              );
            } finally {
              hide();
              bottomSheetModalRef.current?.dismiss();
            }
          }}>
          <StyledText style={styles.secondary}>Hapus</StyledText>
        </StyledButton>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = {
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 8,
    minHeight: NUMBER.defaultWidth * 0.7,
  },
  primary: {
    color: COLORS.white,
    fontSize: 16,
  },
  secondary: {
    color: COLORS.primary,
    fontSize: 16,
  },
};

export default BottomSheetJobs;
