import React, {useCallback, useMemo} from 'react';
import {StyleSheet, Alert, StyleProp, ViewStyle, TextStyle} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import StyledText from '../StyledText';
import StyledButton from '../StyledButton';
import {CustomIcon, IconName} from '../CustomPhosporIcon';
import COLORS from '../../../constants/colors';

// --- Tipe Data ---

/**
 * Mendefinisikan struktur untuk setiap item aksi dalam bottom sheet.
 */
export interface ActionItem {
  /** Teks yang akan ditampilkan pada tombol. */
  label: string;
  /** Fungsi yang akan dipanggil ketika tombol ditekan. Bisa async. */
  onPress: () => void | Promise<void>;
  /** Varian gaya tombol (misal: 'primary', 'secondary', 'danger'). Sesuaikan dengan StyledButton Anda. */
  variant?: 'primary' | 'secondary';
  /** Nama ikon (opsional) yang akan ditampilkan di samping label. */
  icon?: IconName; // Nama ikon dari library Anda (misal: 'pencil-outline', 'trash-outline')
  /** Warna ikon (opsional). */
  iconColor?: string;
  /** Boolean untuk menonaktifkan tombol. */
  disabled?: boolean;
  /** Jika true, akan menampilkan dialog konfirmasi sebelum menjalankan onPress. Berguna untuk aksi destruktif. */
  destructive?: boolean;
  /** Pesan konfirmasi kustom untuk aksi destruktif. */
  destructiveMessage?: string;
  /** Gaya kustom untuk teks tombol. */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * Props untuk komponen BottomSheetAction universal.
 */
interface BottomSheetActionProps {
  /** Ref untuk mengontrol BottomSheetModal dari parent. */
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  /** Array objek ActionItem yang mendefinisikan tombol-tombol aksi. */
  actions: ActionItem[];
  /** Judul opsional untuk ditampilkan di bagian atas bottom sheet. */
  title?: string;
  /** Callback opsional yang dipanggil saat posisi sheet berubah (dari @gorhom/bottom-sheet). */
  handleSheetChanges?: (index: number) => void;
  /** Kustomisasi snap points untuk bottom sheet (default: ['40%']). */
  snapPoints?: (string | number)[];
  /** Props tambahan yang bisa diteruskan ke BottomSheetModal. */
  modalProps?: Partial<
    Omit<BottomSheetModalProps, 'children' | 'snapPoints' | 'onChange' | 'ref'>
  >;
  /** Gaya kustom untuk container utama BottomSheetView. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Gaya kustom untuk judul. */
  titleStyle?: StyleProp<TextStyle>;
}

const BottomSheetAction: React.FC<BottomSheetActionProps> = ({
  bottomSheetModalRef,
  actions,
  title,
  handleSheetChanges,
  snapPoints: customSnapPoints,
  modalProps,
  containerStyle,
  titleStyle,
}) => {
  // Default snap points jika tidak disediakan
  const snapPoints = useMemo(
    () => customSnapPoints || ['40%'],
    [customSnapPoints],
  );

  // Callback untuk backdrop, menutup sheet saat ditekan
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close" // Atau 'collapse' jika Anda lebih suka
      />
    ),
    [],
  );

  // Fungsi yang menangani penekanan tombol aksi
  const handleActionPress = useCallback(
    async (action: ActionItem) => {
      // Fungsi internal untuk menjalankan aksi setelah konfirmasi (jika perlu)
      const executeAction = async () => {
        try {
          await action.onPress(); // Jalankan fungsi onPress yang diberikan
          // Tutup bottom sheet *setelah* aksi berhasil (jika tidak ditutup di dalam onPress)
          // Pertimbangkan: Mungkin lebih baik menutupnya *sebelum* onPress jika ada navigasi
          // bottomSheetModalRef.current?.dismiss();
        } catch (error) {
          console.error(`Error executing action "${action.label}":`, error);
          // Anda mungkin ingin menampilkan Alert error umum di sini jika diperlukan
          // Alert.alert('Error', 'Terjadi kesalahan saat melakukan aksi.');
        } finally {
          // Selalu tutup sheet setelah onPress selesai atau error, kecuali jika parent handle
          // Atau, bisa juga diletakkan sebelum try-catch jika ingin menutup sebelum eksekusi
          bottomSheetModalRef.current?.dismiss();
        }
      };

      // Tutup bottom sheet *sebelum* menjalankan onPress (umumnya lebih baik untuk navigasi/mutasi)
      // bottomSheetModalRef.current?.dismiss(); // Pindahkan ke sini jika preferensi

      if (action.destructive) {
        Alert.alert(
          'Konfirmasi', // Judul konfirmasi
          action.destructiveMessage ||
            `Apakah Anda yakin ingin ${action.label.toLowerCase()}?`, // Pesan default
          [
            {text: 'Batal', style: 'cancel'},
            {
              text: action.label, // Teks tombol konfirmasi
              style: 'destructive',
              onPress: executeAction, // Jalankan aksi jika dikonfirmasi
            },
          ],
          {cancelable: true},
        );
      } else {
        await executeAction(); // Langsung jalankan jika bukan aksi destruktif
      }
    },
    [bottomSheetModalRef], // Sertakan ref dalam dependency array useCallback
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0} // Default index saat muncul
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      {...modalProps} // Sebarkan props modal tambahan
    >
      <BottomSheetView style={[styles.bottomSheetContainer, containerStyle]}>
        {/* Judul Opsional */}
        {title && (
          <StyledText style={[styles.title, titleStyle]}>{title}</StyledText>
        )}

        {/* Render Tombol Aksi */}
        {actions.map((action, index) => (
          <StyledButton
            key={index}
            variant={action.variant || 'secondary'} // Default ke secondary jika tidak diset
            onPress={() => handleActionPress(action)}
            disabled={action.disabled || false}
            style={styles.button} // Beri sedikit margin antar tombol
          >
            {/* Ikon Opsional */}
            {action.icon && (
              // Ganti CustomIcon dengan komponen ikon Anda
              <CustomIcon
                name={action.icon}
                size={18}
                color={
                  action.iconColor ||
                  (action.variant === 'primary' ? COLORS.white : COLORS.primary)
                } // Warna ikon default
                style={styles.icon}
              />
            )}
            {/* Label Tombol */}
            <StyledText
              style={[
                styles.buttonText,
                action.variant === 'primary'
                  ? styles.primaryText
                  : styles.secondaryText,
                action.textStyle, // Terapkan gaya teks kustom
              ]}>
              {action.label}
            </StyledText>
          </StyledButton>
        ))}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24, // Beri padding bawah
    gap: 10, // Jarak antar elemen di dalam sheet
  },
  title: {
    fontSize: 18,
    fontFamily: 'Roboto-Bold', // Sesuaikan font
    color: COLORS.textPrimary,
    marginBottom: 16, // Jarak bawah dari judul ke tombol pertama
    textAlign: 'center',
  },
  button: {
    // Margin atau styling tambahan untuk setiap tombol jika perlu
    // Contoh: flexDirection: 'row', alignItems: 'center', justifyContent: 'center' // Jika ada ikon
  },
  icon: {
    marginRight: 8, // Jarak antara ikon dan teks
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Roboto-Medium', // Sesuaikan font
    textAlign: 'center', // Pusatkan teks jika tidak ada ikon
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.primary, // Warna default untuk secondary/varian lain
  },
  dangerText: {
    color: COLORS.red, // Warna untuk varian 'danger'
  },
});

export default BottomSheetAction;
