import React, {useMemo, forwardRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetHandleProps, // Jika ingin kustom handle
} from '@gorhom/bottom-sheet';
import {colors, fonts, numbers} from '../../contants/styles';
import {CustomIcon, IconName} from './CustomIcon';

export interface BottomSheetAction {
  id: string;
  label: string;
  onPress: () => void;
  iconName?: IconName; // Opsional, nama ikon dari library
  iconElement?: React.ReactNode; // Opsional, elemen ikon kustom
  isDestructive?: boolean; // Untuk menandai aksi yang merusak (mis. warna merah)
  disabled?: boolean;
  textStyle?: TextStyle;
}

interface ReusableBottomSheetModalProps {
  title?: string;
  children?: React.ReactNode; // Konten kustom jika tidak menggunakan 'actions'
  actions?: BottomSheetAction[]; // Daftar aksi untuk ditampilkan sebagai list
  snapPoints?: (string | number)[]; // Titik henti bottom sheet, mis. ['50%', '75%']
  onDismiss?: () => void; // Callback saat bottom sheet ditutup
  enablePanDownToClose?: boolean;
  backdropPressBehavior?: 'close' | 'collapse' | 'none';
  // Anda bisa menambahkan lebih banyak props dari BottomSheetModal jika perlu
  containerStyle?: ViewStyle; // Style untuk BottomSheetView
}

// Menggunakan forwardRef untuk meneruskan ref ke BottomSheetModal
const ReusableBottomSheetModal = forwardRef<
  BottomSheetModal,
  ReusableBottomSheetModalProps
>(
  (
    {
      title,
      children,
      actions,
      snapPoints: customSnapPoints,
      onDismiss,
      enablePanDownToClose = true,
      backdropPressBehavior = 'close',
      containerStyle,
    },
    ref,
  ) => {
    const defaultSnapPoints = useMemo(() => ['40%', '60%'], []); // Default jika tidak ada custom
    const snapPoints = useMemo(
      () => customSnapPoints || defaultSnapPoints,
      [customSnapPoints, defaultSnapPoints],
    );

    // Custom backdrop (opsional, tapi bagus untuk konsistensi)
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1} // Hilang saat ditutup
          appearsOnIndex={0} // Muncul saat snap point pertama
          opacity={0.5} // Tingkat kegelapan backdrop
          pressBehavior={backdropPressBehavior}
        />
      ),
      [backdropPressBehavior],
    );

    return (
      <BottomSheetModal
        ref={ref}
        index={0} // Snap point awal saat terbuka
        snapPoints={snapPoints}
        onChange={index => {
          // console.log('BottomSheetModal index changed to:', index);
          if (index === -1 && onDismiss) {
            // -1 berarti ditutup
            onDismiss();
          }
        }}
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={renderBackdrop} // Menggunakan backdrop kustom
        // handleComponent={renderHandle} // Menggunakan handle kustom jika ada
        // backgroundStyle={{ backgroundColor: colors.surface }} // Bisa juga diatur di sini
        // detached={true} // Jika ingin bottom sheet "mengambang"
        // bottomInset={24} // Untuk detached mode
        enableDynamicSizing={false}>
        <BottomSheetView style={[styles.contentContainer, containerStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {children ? (
            children // Render children jika ada
          ) : actions && actions.length > 0 ? (
            // Render daftar aksi jika actions diberikan
            <View style={styles.actionsListContainer}>
              {actions.map(action => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.actionItem,
                    action.disabled && styles.actionItemDisabled,
                  ]}
                  onPress={() => {
                    action.onPress();
                    // Otomatis tutup bottom sheet setelah aksi ditekan (opsional)
                    // if (ref && 'current' in ref && ref.current) {
                    //   ref.current.dismiss();
                    // }
                  }}
                  disabled={action.disabled}
                  accessibilityLabel={action.label}
                  accessibilityRole="button"
                  accessibilityState={{disabled: action.disabled}}>
                  {action.iconElement ? (
                    action.iconElement
                  ) : action.iconName ? (
                    <CustomIcon
                      name={action.iconName}
                      size={22}
                      style={styles.actionIcon}
                      color={
                        action.isDestructive
                          ? colors.error
                          : action.disabled
                          ? colors.textDisabled
                          : colors.primary
                      }
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.actionLabel,
                      action.isDestructive && styles.actionLabelDestructive,
                      action.disabled && styles.actionLabelDisabled,
                      action.textStyle,
                    ]}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: numbers.padding,
    paddingTop: numbers.padding / 2,
    paddingBottom: numbers.padding * 1.5, // Beri ruang di bawah
    backgroundColor: colors.surface, // Latar belakang konten BottomSheet
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: numbers.padding * 1.5,
  },
  actionsListContainer: {
    // Styling untuk kontainer daftar aksi
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: numbers.padding * 0.8, // Lebih rapat dari padding normal
    // borderBottomWidth: 1,
    // borderBottomColor: colors.border,
  },
  actionItemDisabled: {
    opacity: 0.5,
  },
  actionIcon: {
    marginRight: numbers.padding,
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
  actionLabelDestructive: {
    color: colors.error,
  },
  actionLabelDisabled: {
    color: colors.textDisabled,
  },
  // handleContainer: { // Contoh style untuk custom handle
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   alignItems: 'center',
  //   backgroundColor: colors.surface,
  //   borderTopLeftRadius: numbers.borderRadius * 1.5,
  //   borderTopRightRadius: numbers.borderRadius * 1.5,
  // },
  // handleIndicator: {
  //   width: 40,
  //   height: 5,
  //   backgroundColor: colors.greyMedium,
  //   borderRadius: 2.5,
  // },
});

export default ReusableBottomSheetModal;
