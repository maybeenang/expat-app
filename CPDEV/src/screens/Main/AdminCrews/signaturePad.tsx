import React, {useRef, useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import SignatureCanvas, {
  SignatureCanvasRef,
} from '../../../components/common/SignatureCanvas'; // Sesuaikan path
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle'; // Sesuaikan path
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useAddSignatureMutation} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import {ScreenContainer, StyledButton} from '../../../components/common';
import {colors, numbers} from '../../../contants/styles';

interface SignaturePadScreenProps
  extends NativeStackScreenProps<RootStackParamList, 'SignaturePadScreen'> {}

const SignaturePadScreen: React.FC<SignaturePadScreenProps> = ({
  route,
  navigation,
}) => {
  const {entityId, signatureType, relatedCrewId} = route.params;

  const signatureCanvasRef = useRef<SignatureCanvasRef>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addSignatureMutation = useAddSignatureMutation(relatedCrewId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <UniversalHeaderTitle title={''} />,
    });
  }, [navigation]);

  const handleSaveSignature = (base64String: string) => {
    if (!entityId) {
      Alert.alert('Error', 'ID Entitas tidak ditemukan untuk disimpan.');
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);
    addSignatureMutation.mutate(
      {
        id: entityId,
        type_signature: signatureType,
        base64_signature: base64String,
      },
      {
        onSuccess: response => {
          Alert.alert(
            'Sukses',
            response.message || 'Tanda tangan berhasil disimpan.',
          );
          // Navigasi kembali setelah sukses
          // Bisa ke detail kontrak atau detail kru, tergantung alur
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
        onError: error => {
          Alert.alert(
            'Gagal',
            error.response?.data?.message ||
              error.message ||
              'Gagal menyimpan tanda tangan.',
          );
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      },
    );
  };

  const handleTriggerSave = () => {
    if (!isSubmitting) {
      // Cegah submit ganda
      signatureCanvasRef.current?.getSignature(); // Ini akan memicu onOK di SignatureCanvas
    }
  };

  const handleClear = () => {
    signatureCanvasRef.current?.clearSignature();
  };

  return (
    <ScreenContainer style={styles.screen}>
      <View style={styles.canvasContainer}>
        <SignatureCanvas
          ref={signatureCanvasRef}
          onOK={handleSaveSignature} // onOK akan dipanggil oleh getSignature()
          onEmpty={() =>
            Alert.alert(
              'Info',
              'Harap buat tanda tangan terlebih dahulu sebelum menyimpan.',
            )
          }
          penColor={colors.black}
          backgroundColor={colors.surface}
          // Kita akan menggunakan tombol kustom di bawah canvas
          showNativeButtons={false}
          showClearButton={false} // Akan dihandle oleh tombol kustom di bawah
          showConfirmButton={false} // Akan dihandle oleh tombol kustom di bawah
          descriptionText={`Tanda tangani sebagai ${signatureType}`}
          webStyle={`
            .m-signature-pad { box-shadow: none; border: none; height: 100%; }
            .m-signature-pad--body { border: 1px solid ${colors.border}; border-radius: ${numbers.borderRadius}px; height: calc(100% - 0px); }
            .m-signature-pad--footer { display: none; }
          `}
        />
      </View>

      <View style={styles.footerActions}>
        <StyledButton
          title="Bersihkan"
          onPress={handleClear}
          variant="outlinePrimary"
          style={styles.actionButton}
          disabled={isSubmitting}
        />
        <StyledButton
          title="Simpan Tanda Tangan"
          onPress={handleTriggerSave}
          isLoading={isSubmitting}
          style={styles.actionButton}
          disabled={isSubmitting}
        />
      </View>
      {isSubmitting && ( // Overlay loading sederhana
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  canvasContainer: {
    flex: 1, // Agar canvas mengambil ruang sebanyak mungkin
    margin: numbers.padding,
    backgroundColor: colors.surface, // Beri background pada container canvas
    borderRadius: numbers.borderRadius, // Cocokkan dengan border di webStyle
    overflow: 'hidden', // Penting jika canvas tidak 100% mengisi border radius
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: numbers.padding,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface, // Atau colors.background
  },
  actionButton: {
    flex: 1,
    marginHorizontal: numbers.padding / 2,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SignaturePadScreen;
