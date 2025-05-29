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
} from 'react-native-image-picker';
import COLORS from '../../constants/colors';
import { EnhancedEventImageFeature, EnhancedAsset } from '../../types/custom';

// Types for the component
interface EventImageManagerProps {
  existingImages: EnhancedEventImageFeature[];
  setExistingImages: React.Dispatch<React.SetStateAction<EnhancedEventImageFeature[]>>;
  imagesToDelete: string[];
  setImagesToDelete: React.Dispatch<React.SetStateAction<string[]>>;
  newSelectedImages: EnhancedAsset[];
  setNewSelectedImages: React.Dispatch<React.SetStateAction<EnhancedAsset[]>>;
  isDisabled?: boolean;
}

const EventImageManager: React.FC<EventImageManagerProps> = ({
  existingImages,
  setExistingImages,
  imagesToDelete,
  setImagesToDelete,
  newSelectedImages,
  setNewSelectedImages,
  isDisabled = false,
}) => {
  // Helper function to check if there's a feature image selected
  const hasFeatureImage = () => {
    const featureInExisting = existingImages.some(
      img => img.isFeature && !imagesToDelete.includes(img.id),
    );
    const featureInNew = newSelectedImages.some(img => img.isFeature);
    return featureInExisting || featureInNew;
  };

  // Handler for picking new images
  const handleImagePick = async () => {
    const currentTotalImages =
      (existingImages?.length || 0) -
      imagesToDelete.length +
      newSelectedImages.length;
    if (currentTotalImages >= 5) {
      Alert.alert(
        'Batas Gambar',
        'Anda sudah mencapai batas maksimal 5 gambar.',
      );
      return;
    }

    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5 - currentTotalImages, // Batasi sesuai sisa slot
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
          .map(asset => ({
            ...asset,
            title: `Image ${newSelectedImages.length + 1}`,
            alt: 'Event image',
            isFeature:
              existingImages.length === 0 && newSelectedImages.length === 0,
          }));
        setNewSelectedImages(prev => [...prev, ...validAssets]);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  // Menghapus gambar BARU yang dipilih user (belum diupload)
  const removeNewImage = (index: number) => {
    setNewSelectedImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);

      // If we removed the feature image, set the first remaining image as feature if needed
      if (prev[index].isFeature && newImages.length > 0 && !hasFeatureImage()) {
        return newImages.map((img, i) => ({
          ...img,
          isFeature: i === 0,
        }));
      }

      return newImages;
    });
  };

  // Menandai gambar LAMA untuk dihapus saat submit
  const markExistingImageForDeletion = (imageId: string) => {
    // Check if this is a feature image
    const isFeatureImage = existingImages.find(
      img => img.id === imageId,
    )?.isFeature;

    setImagesToDelete(prev => [...prev, imageId]);

    // If we're marking a feature image for deletion, we need to set a new feature image
    if (isFeatureImage) {
      updateFeatureImageAfterDeletion();
    }
  };

  // Membatalkan penghapusan gambar LAMA
  const unmarkExistingImageForDeletion = (imageId: string) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  };

  const updateFeatureImageAfterDeletion = () => {
    // First try to set another existing image as feature
    const availableExistingImages = existingImages.filter(
      img => !imagesToDelete.includes(img.id),
    );

    if (availableExistingImages.length > 0) {
      setExistingImages(prev =>
        prev.map(img => ({
          ...img,
          isFeature: !imagesToDelete.includes(img.id)
            ? img.id === availableExistingImages[0].id
            : false,
        })),
      );
    }
    // If no existing images are available, try to set a new image as feature
    else if (newSelectedImages.length > 0) {
      setNewSelectedImages(prev =>
        prev.map((img, i) => ({...img, isFeature: i === 0})),
      );
    }
  };

  // Handle updating title for existing images
  const updateExistingImageTitle = (imageId: string, title: string) => {
    setExistingImages(prev =>
      prev.map(img => (img.id === imageId ? {...img, title} : img)),
    );
  };

  // Handle updating alt text for existing images
  const updateExistingImageAlt = (imageId: string, alt: string) => {
    setExistingImages(prev =>
      prev.map(img => (img.id === imageId ? {...img, alt} : img)),
    );
  };

  // Handle updating title for new images
  const updateNewImageTitle = (index: number, title: string) => {
    setNewSelectedImages(prev =>
      prev.map((img, i) => (i === index ? {...img, title} : img)),
    );
  };

  // Handle updating alt text for new images
  const updateNewImageAlt = (index: number, alt: string) => {
    setNewSelectedImages(prev =>
      prev.map((img, i) => (i === index ? {...img, alt} : img)),
    );
  };

  // Set feature image (either existing or new)
  const setFeatureImage = (type: 'existing' | 'new', id: string | number) => {
    // Clear feature flag from all images
    setExistingImages(prev => prev.map(img => ({...img, isFeature: false})));
    setNewSelectedImages(prev => prev.map(img => ({...img, isFeature: false})));

    // Set the new feature image
    if (type === 'existing') {
      setExistingImages(prev =>
        prev.map(img => ({...img, isFeature: img.id === id})),
      );
    } else {
      setNewSelectedImages(prev =>
        prev.map((img, i) => ({...img, isFeature: i === Number(id)})),
      );
    }
  };

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Gambar Event (Maks. 5) *</Text>
      <Text style={styles.subLabel}>
        Pilih satu gambar sebagai gambar utama
      </Text>

      {/* Images Container */}
      <View style={styles.imagesContainer}>
        {/* Render Existing Images that are not marked for deletion */}
        {existingImages.map(image => {
          const isMarkedForDeletion = imagesToDelete.includes(image.id);
          if (isMarkedForDeletion) return null;

          return (
            <View key={image.id} style={styles.imageDetailContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: image.img_url}}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => markExistingImageForDeletion(image.id)}
                  disabled={isDisabled}
                  activeOpacity={0.7}>
                  <Icon
                    name="close-circle"
                    size={24}
                    color={COLORS.error}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.imageDetailsForm}>
                <View style={styles.featureRadio}>
                  <TouchableOpacity
                    style={[
                      styles.radioCircle,
                      image.isFeature && styles.radioSelected,
                    ]}
                    onPress={() => setFeatureImage('existing', image.id)}
                    disabled={isDisabled}>
                    {image.isFeature && (
                      <View style={styles.radioInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.radioLabel}>Gambar Utama</Text>
                </View>

                <TextInput
                  style={styles.imageInput}
                  value={image.title}
                  onChangeText={text =>
                    updateExistingImageTitle(image.id, text)
                  }
                  placeholder="Judul Gambar"
                  placeholderTextColor={COLORS.greyMedium}
                  editable={!isDisabled}
                />

                <TextInput
                  style={styles.imageInput}
                  value={image.alt}
                  onChangeText={text =>
                    updateExistingImageAlt(image.id, text)
                  }
                  placeholder="Teks Alternatif"
                  placeholderTextColor={COLORS.greyMedium}
                  editable={!isDisabled}
                />
              </View>
            </View>
          );
        })}

        {/* Render images marked for deletion */}
        {existingImages.map(image => {
          const isMarkedForDeletion = imagesToDelete.includes(image.id);
          if (!isMarkedForDeletion) {
            return null;
          }

          return (
            <View
              key={image.id}
              style={[
                styles.imageDetailContainer,
                styles.imageMarkedForDeletion,
              ]}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: image.img_url}}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => unmarkExistingImageForDeletion(image.id)}
                  disabled={isDisabled}
                  activeOpacity={0.7}>
                  <Icon
                    name="refresh-circle"
                    size={24}
                    color={COLORS.greyDark}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.deletedImageText}>
                Ditandai untuk dihapus
              </Text>
            </View>
          );
        })}

        {/* Render New Selected Images */}
        {newSelectedImages.map((asset, index) => (
          <View
            key={asset.uri || index}
            style={styles.imageDetailContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{uri: asset.uri}}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => removeNewImage(index)}
                disabled={isDisabled}
                activeOpacity={0.7}>
                <Icon
                  name="close-circle"
                  size={24}
                  color={COLORS.error}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.imageDetailsForm}>
              <View style={styles.featureRadio}>
                <TouchableOpacity
                  style={[
                    styles.radioCircle,
                    asset.isFeature && styles.radioSelected,
                  ]}
                  onPress={() => setFeatureImage('new', index)}
                  disabled={isDisabled}>
                  {asset.isFeature && <View style={styles.radioInner} />}
                </TouchableOpacity>
                <Text style={styles.radioLabel}>Gambar Utama</Text>
              </View>

              <TextInput
                style={styles.imageInput}
                value={asset.title}
                onChangeText={text => updateNewImageTitle(index, text)}
                placeholder="Judul Gambar"
                placeholderTextColor={COLORS.greyMedium}
                editable={!isDisabled}
              />

              <TextInput
                style={styles.imageInput}
                value={asset.alt}
                onChangeText={text => updateNewImageAlt(index, text)}
                placeholder="Teks Alternatif"
                placeholderTextColor={COLORS.greyMedium}
                editable={!isDisabled}
              />
            </View>
          </View>
        ))}

        {/* Add Image Button (conditional based on total images) */}
        {(existingImages?.length || 0) -
          imagesToDelete.length +
          newSelectedImages.length <
          5 && (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleImagePick}
            disabled={isDisabled}
            activeOpacity={0.7}>
            <Icon name="add" size={28} color={COLORS.primary} />
            <Text style={styles.addImageText}>
              Tambah Gambar{'\n'}(
              {(existingImages?.length || 0) -
                imagesToDelete.length +
                newSelectedImages.length}
              /5)
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
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
  imageMarkedForDeletion: {
    opacity: 0.5,
    borderWidth: 2,
    borderColor: COLORS.red,
    borderRadius: 8,
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
  deletedImageText: {
    textAlign: 'center',
    color: COLORS.red,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default EventImageManager; 