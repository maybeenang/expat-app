import {useState, useCallback, useRef} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import type {AdminCrew} from '../types'; // Sesuaikan path
import {Alert} from 'react-native';
import {useAddUnavailableDateMutation} from './useAdminCrewsQuery';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

export interface AdminCrewActionsHookProps {}

export const useAdminCrewActions = (props?: AdminCrewActionsHookProps) => {
  const actionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const manageDatesBottomSheetRef = useRef<BottomSheetModal>(null); // Ubah nama ref

  const [selectedCrewForAction, setSelectedCrewForAction] =
    useState<AdminCrew | null>(null);
  const addUnavailableDateMutation = useAddUnavailableDateMutation();

  const openActionsSheet = useCallback((crew: AdminCrew) => {
    setSelectedCrewForAction(crew);
    actionsBottomSheetRef.current?.present();
  }, []);

  const closeActionsSheet = useCallback(() => {
    actionsBottomSheetRef.current?.dismiss();
  }, []);

  // Ubah nama fungsi agar lebih jelas
  const openManageDatesSheet = useCallback(() => {
    if (!selectedCrewForAction) {
      return;
    }
    closeActionsSheet();
    setTimeout(() => manageDatesBottomSheetRef.current?.present(), 250);
  }, [selectedCrewForAction, closeActionsSheet]);

  const closeManageDatesSheet = useCallback(() => {
    manageDatesBottomSheetRef.current?.dismiss();
  }, []);

  const loading = useLoadingOverlayStore();

  // Menerima array string tanggal
  const handleSaveUnavailableDates = useCallback(
    async (updatedDateStrings: string[]) => {
      console.log(updatedDateStrings);
      if (!selectedCrewForAction) {
        return;
      }

      loading.show();
      try {
        await addUnavailableDateMutation.mutateAsync(
          {
            id: selectedCrewForAction.id,
            unavailable_date: updatedDateStrings,
          },
          {
            onSuccess: response => {
              Alert.alert(
                'Sukses',
                response.message || 'Tanggal berhasil diperbarui.',
              );
              closeManageDatesSheet();
              setSelectedCrewForAction(null);
            },
            onError: error => {
              Alert.alert(
                'Gagal',
                error.response?.data?.message ||
                  error.message ||
                  'Gagal memperbarui tanggal.',
              );
            },
          },
        );
      } catch (error) {
        console.error('Error updating unavailable dates:', error);
      } finally {
        loading.hide();
      }
    },
    [
      selectedCrewForAction,
      addUnavailableDateMutation,
      closeManageDatesSheet,
      loading,
    ],
  );

  return {
    actionsBottomSheetRef,
    manageDatesBottomSheetRef, // Nama ref diupdate
    selectedCrewForAction,
    openActionsSheet,
    closeActionsSheet,
    openManageDatesSheet, // Nama fungsi diupdate
    closeManageDatesSheet,
    handleSaveUnavailableDates, // Nama fungsi diupdate
    isSavingUnavailableDate: addUnavailableDateMutation.isPending,
  };
};
