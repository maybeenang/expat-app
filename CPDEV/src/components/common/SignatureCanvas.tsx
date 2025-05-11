import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {View, StyleSheet, ViewStyle, Text} from 'react-native';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
import {colors, fonts, numbers} from '../../contants/styles';
import {StyledButton} from '.';

export interface SignatureCanvasRef {
  getSignature: () => void; // Metode untuk memicu pengambilan base64
  clearSignature: () => void;
}

interface SignatureCanvasProps {
  descriptionText?: string;
  clearText?: string;
  confirmText?: string; // Teks untuk tombol konfirmasi internal jika footer tidak disembunyikan
  penColor?: string;
  backgroundColor?: string;
  minWidth?: number; // Lebar minimal goresan pena
  maxWidth?: number; // Lebar maksimal goresan pena
  webStyle?: string; // Kustomisasi CSS untuk canvas web view
  onBegin?: () => void; // Callback saat mulai menggambar
  onEnd?: () => void; // Callback saat selesai menggambar (melepas jari/stylus)
  onOK: (signature: string) => void; // Callback saat tanda tangan dikonfirmasi, mengembalikan base64 string
  onEmpty?: () => void; // Callback jika mencoba konfirmasi saat canvas kosong
  onClear?: () => void; // Callback setelah canvas dibersihkan
  showNativeButtons?: boolean; // Apakah menampilkan tombol Clear/Confirm bawaan canvas
  showClearButton?: boolean; // Jika showNativeButtons false, apakah menampilkan tombol clear kustom
  showConfirmButton?: boolean; // Jika showNativeButtons false, apakah menampilkan tombol confirm kustom
  confirmButtonText?: string; // Teks untuk tombol confirm kustom
  clearButtonText?: string; // Teks untuk tombol clear kustom
  footerComponent?: React.ReactNode; // Komponen footer kustom jika tombol default tidak digunakan
  style?: ViewStyle; // Style untuk container View utama
  canvasContainerStyle?: ViewStyle; // Style khusus untuk View pembungkus SignatureScreen
}

const SignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(
  (
    {
      descriptionText = 'Tanda Tangan di Sini',
      clearText = 'Bersihkan',
      confirmText = 'Simpan',
      penColor = colors.black,
      backgroundColor = colors.white, // Warna canvas
      minWidth = 1.5,
      maxWidth = 3.5,
      webStyle: customWebStyle,
      onBegin,
      onEnd,
      onOK,
      onEmpty,
      onClear,
      showNativeButtons = false, // Defaultnya sembunyikan tombol bawaan, kita buat tombol sendiri
      showClearButton = true,
      showConfirmButton = true,
      confirmButtonText = 'Simpan Tanda Tangan',
      clearButtonText = 'Bersihkan',
      footerComponent,
      style,
      canvasContainerStyle,
    },
    ref,
  ) => {
    const signatureCanvasRef = useRef<SignatureViewRef>(null);

    // Expose metode ke parent component menggunakan useImperativeHandle
    useImperativeHandle(ref, () => ({
      getSignature: () => {
        signatureCanvasRef.current?.readSignature();
      },
      clearSignature: () => {
        signatureCanvasRef.current?.clearSignature();
      },
      readSignatureData: () => {
        return signatureCanvasRef.current?.readSignatureData() || [];
      },
    }));

    const defaultWebStyle = `
      .m-signature-pad {
        box-shadow: none;
        border: none;
        height: 100%; /* Pastikan signature pad mengisi tinggi */
      }
      .m-signature-pad--body {
        border: 1px dashed ${colors.greyMedium};
        border-radius: ${numbers.borderRadius}px;
        height: calc(100% - 0px); /* Sesuaikan jika ada footer internal */
      }
      .m-signature-pad--footer {
        display: ${
          showNativeButtons ? 'block' : 'none'
        }; /* Kontrol visibilitas footer bawaan */
        margin-top: 0px;
      }
      .m-signature-pad--footer .button {
        font-family: ${
          fonts.medium
        }; /* Sesuaikan font tombol bawaan jika ditampilkan */
      }
      .m-signature-pad--footer .button.clear {
        color: ${colors.textSecondary};
      }
      .m-signature-pad--footer .button.save {
        color: ${colors.primary};
      }
    `;

    const handleInternalOK = (signature: string) => {
      // signature sudah termasuk prefix "data:image/png;base64,"
      if (signature) {
        onOK(signature);
      } else if (onEmpty) {
        onEmpty();
      }
    };

    const handleInternalEmpty = () => {
      if (onEmpty) {
        onEmpty();
      } else {
        // console.log("Canvas tanda tangan kosong.");
      }
    };

    const handleInternalClear = () => {
      if (onClear) {
        onClear();
      }
    };

    return (
      <View style={[styles.container, style]}>
        <View style={[styles.canvasWrapper, canvasContainerStyle]}>
          <Text style={{textAlign: 'center'}}>{descriptionText}</Text>
          <SignatureScreen
            ref={signatureCanvasRef}
            onOK={handleInternalOK}
            onEmpty={handleInternalEmpty}
            onClear={handleInternalClear}
            onBegin={onBegin}
            onEnd={onEnd}
            descriptionText={descriptionText}
            clearText={clearText}
            confirmText={confirmText}
            penColor={penColor}
            backgroundColor={backgroundColor}
            minWidth={minWidth}
            maxWidth={maxWidth}
            webStyle={customWebStyle || defaultWebStyle}
            autoClear={false} // Biasanya false agar user bisa lihat sebelum konfirmasi manual
            // imageType="image/png" // Default
          />
        </View>

        {footerComponent !== undefined ? (
          footerComponent
        ) : !showNativeButtons && (showClearButton || showConfirmButton) ? (
          <View style={styles.customFooter}>
            {showClearButton && (
              <StyledButton
                title={clearButtonText}
                onPress={() => signatureCanvasRef.current?.clearSignature()}
                variant="outlinePrimary" // Atau varian lain
                style={styles.footerButton}
              />
            )}
            {showConfirmButton && (
              <StyledButton
                title={confirmButtonText}
                onPress={() => signatureCanvasRef.current?.readSignature()}
                style={styles.footerButton}
              />
            )}
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1, // Agar mengisi ruang yang diberikan (misalnya di dalam BottomSheet)
    justifyContent: 'center', // Pusatkan canvas jika ada sisa ruang
  },
  canvasWrapper: {
    flex: 1, // Biarkan canvas mengambil ruang sebanyak mungkin secara vertikal
    // backgroundColor: colors.red, // Background untuk area canvas jika perlu
    // borderRadius: numbers.borderRadius, // Bisa ditambahkan jika ada border
    // overflow: 'hidden', // Jika pakai borderRadius
  },
  customFooter: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: numbers.padding,
    paddingHorizontal: numbers.padding / 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: numbers.padding / 2,
  },
});

export default SignatureCanvas;
