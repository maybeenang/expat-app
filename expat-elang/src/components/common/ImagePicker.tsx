import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import COLORS from '../../constants/colors';

interface ImagePickerProps {
  selectedImages: Asset[];
  onImagesChange: (images: Asset[]) => void;
  maxImages?: number;
  isDisabled?: boolean;
  label?: string;
}

const ImagePicker: React.FC<ImagePickerProps> = ({
  selectedImages,
  onImagesChange,
  maxImages = 5,
  isDisabled = false,
  label = 'Gambar',
}) => {
  const handleImagePick = async () => {
    const remainingSlots = maxImages - selectedImages.length;
    if (remainingSlots <= 0) {
      Alert.alert(
        'Batas Gambar',
        `Anda sudah mencapai batas maksimal ${maxImages} gambar.`,
      );
      return;
    }

    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: remainingSlots,
        quality: 0.7,
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled image picker');
      } else if (result.errorCode) {
        console.log('ImagePicker Error: ', result.errorMessage);
        Alert.alert('Error', 'Gagal memilih gambar: ' + result.errorMessage);
      } else if (result.assets && result.assets.length > 0) {
        const validAssets = result.assets.filter(asset => asset.uri);
        onImagesChange([...selectedImages, ...validAssets]);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>
        Gambar pertama akan menjadi gambar utama (feature image)
      </Text>
      <View style={styles.imageContainer}>
        {selectedImages.map((image, index) => (
          <View key={image.uri || index} style={styles.imageWrapper}>
            <Image
              source={{uri: image.uri}}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => !isDisabled && removeImage(index)}
              disabled={isDisabled}
              activeOpacity={0.7}>
              <Icon name="close-circle" size={24} color={COLORS.red} />
            </TouchableOpacity>
            {index === 0 && (
              <View style={styles.featureBadge}>
                <Text style={styles.featureText}>Feature</Text>
              </View>
            )}
          </View>
        ))}

        {selectedImages.length < maxImages && (
          <TouchableOpacity
            style={[styles.addImageButton, isDisabled && styles.disabledInput]}
            onPress={handleImagePick}
            disabled={isDisabled}
            activeOpacity={0.7}>
            <Icon name="camera-outline" size={30} color={COLORS.primary} />
            <Text style={styles.addImageText}>Tambah Gambar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  featureBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featureText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Roboto-Medium',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 5,
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  disabledInput: {
    opacity: 0.5,
  },

  subLabel: {
    fontSize: 12,
    color: COLORS.greyDark,
    marginBottom: 8,
    fontStyle: 'italic',
  },
});

export default ImagePicker;

