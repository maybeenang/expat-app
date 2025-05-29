import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import {
  launchImageLibrary,
  ImagePickerResponse,
  Asset,
} from 'react-native-image-picker';
import COLORS from '../../constants/colors';

// Enhanced type for image assets with additional properties
export interface EnhancedImageAsset extends Asset {
  title: string;
  alt: string;
  isFeature: boolean;
}

interface EventImageUploaderProps {
  selectedImages: EnhancedImageAsset[];
  onImagesChange: (images: EnhancedImageAsset[]) => void;
  maxImages?: number;
  isDisabled?: boolean;
  label?: string;
}

const EventImageUploader: React.FC<EventImageUploaderProps> = ({
  selectedImages,
  onImagesChange,
  maxImages = 5,
  isDisabled = false,
  label = 'Gambar Event',
}) => {
  // Handler for picking new images
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
        // Convert assets to enhanced assets with title, alt, and feature flag
        const validAssets = result.assets
          .filter(asset => asset.uri)
          .map((asset, index) => ({
            ...asset,
            title: `Image ${selectedImages.length + index + 1}`,
            alt: 'Event image',
            isFeature: selectedImages.length === 0 && index === 0, // Make first image feature if none exist
          }));
        onImagesChange([...selectedImages, ...validAssets]);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  // Remove image from selection
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const removedImage = newImages[index];
    newImages.splice(index, 1);

    // If we removed the feature image, set the first remaining image as feature if needed
    if (removedImage.isFeature && newImages.length > 0) {
      newImages[0] = {...newImages[0], isFeature: true};
    }

    onImagesChange(newImages);
  };

  // Update image title
  const updateImageTitle = (index: number, title: string) => {
    const newImages = [...selectedImages];
    newImages[index] = {...newImages[index], title};
    onImagesChange(newImages);
  };

  // Update image alt text
  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...selectedImages];
    newImages[index] = {...newImages[index], alt};
    onImagesChange(newImages);
  };

  // Set an image as the feature image
  const setFeatureImage = (index: number) => {
    const newImages = selectedImages.map((img, i) => ({
      ...img,
      isFeature: i === index,
    }));
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} (Maks. {maxImages}) *
      </Text>
      <Text style={styles.subLabel}>
        Pilih satu gambar sebagai gambar utama
      </Text>

      <View style={styles.imagesContainer}>
        {selectedImages.map((asset, index) => (
          <View key={asset.uri || index} style={styles.imageDetailContainer}>
            <View style={styles.imageWrapper}>
              <Image source={{uri: asset.uri}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => !isDisabled && removeImage(index)}
                disabled={isDisabled}
                activeOpacity={0.7}>
                <Icon name="close-circle" size={24} color={COLORS.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.imageDetailsForm}>
              <View style={styles.featureRadio}>
                <TouchableOpacity
                  style={[
                    styles.radioCircle,
                    asset.isFeature && styles.radioSelected,
                  ]}
                  onPress={() => !isDisabled && setFeatureImage(index)}
                  disabled={isDisabled}>
                  {asset.isFeature && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioLabel}>Gambar Utama</Text>
              </View>

              <TextInput
                style={styles.imageInput}
                value={asset.title}
                onChangeText={text => updateImageTitle(index, text)}
                placeholder="Judul Gambar"
                placeholderTextColor={COLORS.greyMedium}
                editable={!isDisabled}
              />

              <TextInput
                style={styles.imageInput}
                value={asset.alt}
                onChangeText={text => updateImageAlt(index, text)}
                placeholder="Teks Alternatif"
                placeholderTextColor={COLORS.greyMedium}
                editable={!isDisabled}
              />
            </View>
          </View>
        ))}

        {selectedImages.length < maxImages && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleImagePick}
            disabled={isDisabled}
            activeOpacity={0.7}>
            <Icon name="add" size={28} color={COLORS.primary} />
            <Text style={styles.addImageText}>
              Tambah Gambar{'\n'}({selectedImages.length}/{maxImages})
            </Text>
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
  subLabel: {
    fontSize: 12,
    color: COLORS.greyDark,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  imagesContainer: {
    marginTop: 12,
    gap: 16,
  },
  imageDetailContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyLight,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 180,
    marginBottom: 12,
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
  addImageButton: {
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 12,
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  imageDetailsForm: {
    gap: 8,
  },
  imageInput: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  featureRadio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    borderColor: COLORS.primary,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textPrimary,
  },
});

export default EventImageUploader;

