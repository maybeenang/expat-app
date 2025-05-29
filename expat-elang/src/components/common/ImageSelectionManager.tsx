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

// Enhanced image type for new images
export interface EnhancedImageAsset extends Asset {
  title: string;
  alt: string;
  isFeature: boolean;
}

// Type for existing images from backend
export interface ExistingImageType {
  id: string;
  img_url: string;
  title: string;
  alt: string;
  isFeature: boolean;
  [key: string]: any; // Allow additional properties
}

interface ImageSelectionManagerProps {
  // For new images
  selectedImages: EnhancedImageAsset[];
  onImagesChange: (images: EnhancedImageAsset[]) => void;
  
  // For existing images (in case of update)
  existingImages?: ExistingImageType[];
  onExistingImagesChange?: (images: ExistingImageType[]) => void;
  imagesToDelete?: string[];
  onImagesToDeleteChange?: (imagesToDelete: string[]) => void;
  
  // Configuration
  maxImages?: number;
  isDisabled?: boolean;
  label?: string;
  showExistingImagesLabel?: string;
  addNewImagesLabel?: string;
}

const ImageSelectionManager: React.FC<ImageSelectionManagerProps> = ({
  selectedImages,
  onImagesChange,
  existingImages = [],
  onExistingImagesChange,
  imagesToDelete = [],
  onImagesToDeleteChange,
  maxImages = 5,
  isDisabled = false,
  label = 'Gambar',
  showExistingImagesLabel = 'Gambar Tersimpan',
  addNewImagesLabel = 'Tambah Gambar Baru',
}) => {
  const hasExistingImages = existingImages.length > 0 && onExistingImagesChange;
  const availableExistingImages = existingImages.filter(
    img => !imagesToDelete.includes(img.id)
  );
  
  const totalImagesCount = selectedImages.length + availableExistingImages.length;
  const remainingSlots = maxImages - totalImagesCount;

  // Handler for picking new images
  const handleImagePick = async () => {
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
        
        // Convert to enhanced images with title, alt and feature flag
        const newEnhancedImages = validAssets.map((asset, index) => ({
          ...asset,
          title: `Image ${selectedImages.length + index + 1}`,
          alt: 'Image description',
          isFeature: availableExistingImages.length === 0 && 
                    selectedImages.length === 0 && 
                    index === 0, // First image is feature if no other images exist
        }));
        
        onImagesChange([...selectedImages, ...newEnhancedImages]);
      }
    } catch (e) {
      console.error('Error picking image:', e);
      Alert.alert('Error', 'Gagal memilih gambar. Silakan coba lagi.');
    }
  };

  // Remove a new image
  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const removedImage = newImages[index];
    newImages.splice(index, 1);
    
    // If we removed the feature image, set the first remaining image as feature if needed
    if (removedImage.isFeature) {
      // Check if there's any existing feature image
      const hasExistingFeature = availableExistingImages.some(img => img.isFeature);
      
      if (!hasExistingFeature) {
        if (newImages.length > 0) {
          newImages[0] = {...newImages[0], isFeature: true};
        } else if (availableExistingImages.length > 0 && onExistingImagesChange) {
          // Set first existing image as feature if no new images left
          const updatedExistingImages = existingImages.map(img => ({
            ...img,
            isFeature: img.id === availableExistingImages[0].id && !imagesToDelete.includes(img.id),
          }));
          onExistingImagesChange(updatedExistingImages);
        }
      }
    }
    
    onImagesChange(newImages);
  };
  
  // Toggle deletion status of an existing image
  const toggleImageDeletion = (imageId: string) => {
    if (!onImagesToDeleteChange) return;
    
    const isMarkedForDeletion = imagesToDelete.includes(imageId);
    let newImagesToDelete: string[];
    
    if (isMarkedForDeletion) {
      // Unmark for deletion
      newImagesToDelete = imagesToDelete.filter(id => id !== imageId);
    } else {
      // Mark for deletion
      newImagesToDelete = [...imagesToDelete, imageId];
      
      // If we're marking a feature image for deletion, set another image as feature
      const markedImage = existingImages.find(img => img.id === imageId);
      if (markedImage?.isFeature && onExistingImagesChange) {
        const remainingExistingImages = existingImages.filter(
          img => !newImagesToDelete.includes(img.id)
        );
        
        if (remainingExistingImages.length > 0) {
          // Set first remaining existing image as feature
          const updatedExistingImages = existingImages.map(img => ({
            ...img,
            isFeature: img.id === remainingExistingImages[0].id && !newImagesToDelete.includes(img.id),
          }));
          onExistingImagesChange(updatedExistingImages);
        } else if (selectedImages.length > 0) {
          // Set first new image as feature
          const updatedNewImages = selectedImages.map((img, i) => ({
            ...img,
            isFeature: i === 0,
          }));
          onImagesChange(updatedNewImages);
        }
      }
    }
    
    onImagesToDeleteChange(newImagesToDelete);
  };
  
  // Update image title for new images
  const updateImageTitle = (index: number, title: string) => {
    const newImages = [...selectedImages];
    newImages[index] = {...newImages[index], title};
    onImagesChange(newImages);
  };
  
  // Update image alt text for new images
  const updateImageAlt = (index: number, alt: string) => {
    const newImages = [...selectedImages];
    newImages[index] = {...newImages[index], alt};
    onImagesChange(newImages);
  };
  
  // Update existing image title
  const updateExistingImageTitle = (imageId: string, title: string) => {
    if (!onExistingImagesChange) return;
    
    const updatedImages = existingImages.map(img => 
      img.id === imageId ? {...img, title} : img
    );
    onExistingImagesChange(updatedImages);
  };
  
  // Update existing image alt text
  const updateExistingImageAlt = (imageId: string, alt: string) => {
    if (!onExistingImagesChange) return;
    
    const updatedImages = existingImages.map(img => 
      img.id === imageId ? {...img, alt} : img
    );
    onExistingImagesChange(updatedImages);
  };
  
  // Set a new image as the feature image
  const setNewImageAsFeature = (index: number) => {
    // Set all existing images to non-feature
    if (onExistingImagesChange) {
      const updatedExistingImages = existingImages.map(img => ({
        ...img,
        isFeature: false,
      }));
      onExistingImagesChange(updatedExistingImages);
    }
    
    // Set only the selected new image as feature
    const updatedNewImages = selectedImages.map((img, i) => ({
      ...img,
      isFeature: i === index,
    }));
    onImagesChange(updatedNewImages);
  };
  
  // Set an existing image as the feature image
  const setExistingImageAsFeature = (imageId: string) => {
    if (!onExistingImagesChange) return;
    
    // Update existing images
    const updatedExistingImages = existingImages.map(img => ({
      ...img,
      isFeature: img.id === imageId,
    }));
    onExistingImagesChange(updatedExistingImages);
    
    // Update new images to remove feature flag
    const updatedNewImages = selectedImages.map(img => ({
      ...img,
      isFeature: false,
    }));
    onImagesChange(updatedNewImages);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.subLabel}>
        Pilih satu gambar sebagai gambar utama
      </Text>

      {/* Existing Images Section */}
      {hasExistingImages && existingImages.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{showExistingImagesLabel}</Text>
          <Text style={styles.subLabel}>
            Pilih gambar yang ingin dihapus
          </Text>

          <View style={styles.imagesContainer}>
            {existingImages.map(image => {
              const isMarkedForDeletion = imagesToDelete.includes(image.id);

              return (
                <View
                  key={image.id}
                  style={[
                    styles.imageDetailContainer,
                    isMarkedForDeletion && styles.imageMarkedForDeletion,
                  ]}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={{uri: image.img_url}}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => !isDisabled && toggleImageDeletion(image.id)}
                      disabled={isDisabled}
                      activeOpacity={0.7}>
                      <Icon
                        name={
                          isMarkedForDeletion
                            ? 'refresh-circle'
                            : 'close-circle'
                        }
                        size={24}
                        color={
                          isMarkedForDeletion
                            ? COLORS.greyDark
                            : COLORS.error
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  {isMarkedForDeletion ? (
                    <Text style={styles.deletedImageText}>
                      Ditandai untuk dihapus
                    </Text>
                  ) : (
                    <View style={styles.imageDetailsForm}>
                      <View style={styles.featureRadio}>
                        <TouchableOpacity
                          style={[
                            styles.radioCircle,
                            image.isFeature && styles.radioSelected,
                          ]}
                          onPress={() => !isDisabled && setExistingImageAsFeature(image.id)}
                          disabled={isDisabled}>
                          {image.isFeature && <View style={styles.radioInner} />}
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>Gambar Utama</Text>
                      </View>
                      
                      <TextInput
                        style={styles.imageInput}
                        value={image.title}
                        onChangeText={text => updateExistingImageTitle(image.id, text)}
                        placeholder="Judul Gambar"
                        placeholderTextColor={COLORS.greyMedium}
                        editable={!isDisabled}
                      />
                      
                      <TextInput
                        style={styles.imageInput}
                        value={image.alt}
                        onChangeText={text => updateExistingImageAlt(image.id, text)}
                        placeholder="Teks Alternatif"
                        placeholderTextColor={COLORS.greyMedium}
                        editable={!isDisabled}
                      />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* New Images Section */}
      <View style={styles.sectionContainer}>
        {hasExistingImages && (
          <Text style={styles.sectionLabel}>{addNewImagesLabel}</Text>
        )}

        <View style={styles.imagesContainer}>
          {selectedImages.map((image, index) => (
            <View
              key={image.uri || index}
              style={styles.imageDetailContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={{uri: image.uri}}
                  style={styles.imagePreview}
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => !isDisabled && removeImage(index)}
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
                    onPress={() => !isDisabled && setNewImageAsFeature(index)}
                    disabled={isDisabled}>
                    {image.isFeature && <View style={styles.radioInner} />}
                  </TouchableOpacity>
                  <Text style={styles.radioLabel}>Gambar Utama</Text>
                </View>
                
                <TextInput
                  style={styles.imageInput}
                  value={image.title}
                  onChangeText={text => updateImageTitle(index, text)}
                  placeholder="Judul Gambar"
                  placeholderTextColor={COLORS.greyMedium}
                  editable={!isDisabled}
                />
                
                <TextInput
                  style={styles.imageInput}
                  value={image.alt}
                  onChangeText={text => updateImageAlt(index, text)}
                  placeholder="Teks Alternatif"
                  placeholderTextColor={COLORS.greyMedium}
                  editable={!isDisabled}
                />
              </View>
            </View>
          ))}

          {totalImagesCount < maxImages && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handleImagePick}
              disabled={isDisabled}
              activeOpacity={0.7}>
              <Icon name="add" size={28} color={COLORS.primary} />
              <Text style={styles.addImageText}>
                Tambah Gambar{'\n'}({totalImagesCount}/{maxImages})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

// Utility function to prepare images for API submission
export const prepareImagesForSubmission = (
  enhancedImages: EnhancedImageAsset[],
  existingImages: ExistingImageType[] = [],
  imagesToDelete: string[] = []
) => {
  // Find the feature image
  let featureImageId = '';

  // First check existing images (those not marked for deletion)
  const featureExistingImage = existingImages.find(
    img => img.isFeature && !imagesToDelete.includes(img.id),
  );

  // Then check new images
  const featureNewImage = enhancedImages.find(img => img.isFeature);

  if (featureExistingImage) {
    featureImageId = featureExistingImage.id;
  } else if (featureNewImage) {
    featureImageId = featureNewImage.fileName || '';
  } else {
    // If no feature image is explicitly set, use the first available image
    const firstExistingImage = existingImages.find(
      img => !imagesToDelete.includes(img.id),
    );

    if (firstExistingImage) {
      featureImageId = firstExistingImage.id;
    } else if (enhancedImages.length > 0) {
      featureImageId = enhancedImages[0].fileName || '';
    }
  }

  // Prepare image uploads from newly selected images
  const imagesToUpload = enhancedImages
    .filter(image => image.uri)
    .map(image => ({
      uri: image.uri!,
      type: image.type || 'image/jpeg',
      name: image.fileName || `image_${Date.now()}_${image.title}.jpg`,
    }));

  // Get titles and alt text from both existing and new images
  const imageInfo = existingImages
    .filter(img => !imagesToDelete.includes(img.id))
    .map(img => ({
      title: img.title || '',
      alt: img.alt || '',
    }));

  // Add new images' titles and alts
  const enhancedImagesInfo = enhancedImages.map(img => ({
    title: img.title || '',
    alt: img.alt || '',
  }));

  // Combine existing and new image Info
  const combinedImageInfo = [...imageInfo, ...enhancedImagesInfo];

  return {
    featureImageId,
    imagesToUpload,
    imageInfo: {
      titles: combinedImageInfo.map(img => img.title),
      alts: combinedImageInfo.map(img => img.alt),
    },
    hasFeatureImage: featureImageId !== '',
  };
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
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
    color: COLORS.textSecondary,
    marginBottom: 8,
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
    marginBottom: 16,
    width: '100%',
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
  deletedImageText: {
    textAlign: 'center',
    color: COLORS.red,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  imageDetailsForm: {
    gap: 8,
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
  addImageButton: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
  },
  addImageText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
});

export default ImageSelectionManager; 