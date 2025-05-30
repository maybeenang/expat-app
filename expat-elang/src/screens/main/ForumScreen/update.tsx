import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../../constants/colors';
import StyledText from '../../../components/common/StyledText';
import {CustomIcon} from '../../../components/common/CustomPhosporIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ALL_FORUM_CATEGORY_PLACEHOLDER,
  MY_FORUM_CATEGORY_PLACEHOLDER,
  useForumCategoriesQuery,
  useForumDetailQuery,
  useUpdateForumMutation,
} from '../../../hooks/useForumQuery';
import {UpdateForumPayload} from '../../../types/forum';
import {RootStackParamList} from '../../../navigation/types';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import ImageSelectionManager, {
  EnhancedImageAsset,
  ExistingImageType,
  prepareImagesForSubmission,
} from '../../../components/common/ImageSelectionManager';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumUpdate'>;

interface ForumFormData {
  title: string;
  content: string;
  categories: string[];
}

const ForumUpdateScreen = ({navigation, route}: Props) => {
  const {forumId} = route.params;
  const [formData, setFormData] = useState<ForumFormData>({
    title: '',
    content: '',
    categories: [],
  });

  const [existingImages, setExistingImages] = useState<ExistingImageType[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImageAsset[]>(
    [],
  );

  const {show, hide} = useLoadingOverlayStore();

  const updateForumMutation = useUpdateForumMutation();
  const {data: categories = []} = useForumCategoriesQuery();

  const {data: forumDetail, isLoading} = useForumDetailQuery(forumId);

  useEffect(() => {
    if (forumDetail) {
      hide();
      const forum = forumDetail;
      setFormData({
        title: forum.mainTopic.title,
        content: forum.mainTopic.contentHTML,
        categories: forum.mainTopic.categories.map(cat => {
          return categories.filter(c => c.name === cat)[0]?.id || '';
        }),
      });

      // Setup existing images
      const existingImagesArray: ExistingImageType[] = [];

      // Add feature image if exists
      if (forum.mainTopic.images && forum.mainTopic.images.length > 0) {
        forum.mainTopic.images.forEach((img, index) => {
          existingImagesArray.push({
            id: img.id || `feature-${index}`,
            img_url: img.img_url,
            title: img.img_title || '',
            alt: img.img_alt || '',
            isFeature: img.is_feature === '1',
          });
        });
      }

      setExistingImages(existingImagesArray);
      setImagesToDelete([]);
      setEnhancedImages([]);
    } else {
      show();
    }

    return () => {
      setFormData({
        title: '',
        content: '',
        categories: [],
      });
      setExistingImages([]);
      setImagesToDelete([]);
      setEnhancedImages([]);
    };
  }, [forumDetail, categories, show, hide]);

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      const isSelected = prev.categories.includes(categoryId);
      if (isSelected) {
        return {
          ...prev,
          categories: prev.categories.filter(id => id !== categoryId),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, categoryId],
        };
      }
    });
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Judul forum tidak boleh kosong');
      return false;
    }
    if (!formData.content.trim()) {
      Alert.alert('Error', 'Konten forum tidak boleh kosong');
      return false;
    }
    if (formData.categories.length === 0) {
      Alert.alert('Error', 'Pilih minimal satu kategori');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare images for submission
      const {featureImageId, imagesToUpload, imageInfo} =
        prepareImagesForSubmission(
          enhancedImages,
          existingImages,
          imagesToDelete,
        );

      const payload: UpdateForumPayload = {
        id: forumId,
        forum_title: formData.title,
        forum_content: formData.content,
        images: imagesToUpload,
        category: formData.categories,
        imege_title: imageInfo.titles, // Note: This matches the API type which has a typo
        image_alt: imageInfo.alts,
        is_feature: featureImageId,
        images_deleted: imagesToDelete.length > 0 ? imagesToDelete : undefined,
      };

      show();
      try {
        await updateForumMutation.mutateAsync(payload);
      } catch (e) {
        console.log('Update Error:', e);
        throw new Error('Failed to update forum');
      } finally {
        hide();
      }
      Alert.alert('Success', 'Forum berhasil diperbarui', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui forum. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView style={styles.container}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <StyledText style={styles.label} weight="medium">
            Judul Forum
          </StyledText>
          <TextInput
            style={styles.input}
            placeholder="Masukkan judul forum"
            placeholderTextColor={COLORS.greyDark}
            value={formData.title}
            onChangeText={text => setFormData(prev => ({...prev, title: text}))}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputGroup}>
          <StyledText style={styles.label} weight="medium">
            Konten Forum
          </StyledText>
          <TextInput
            style={[styles.input, styles.contentInput]}
            placeholder="Tulis konten forum di sini"
            placeholderTextColor={COLORS.greyDark}
            value={formData.content}
            onChangeText={text =>
              setFormData(prev => ({...prev, content: text}))
            }
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Image Selection Manager */}
        <ImageSelectionManager
          selectedImages={enhancedImages}
          onImagesChange={setEnhancedImages}
          existingImages={existingImages}
          onExistingImagesChange={setExistingImages}
          imagesToDelete={imagesToDelete}
          onImagesToDeleteChange={setImagesToDelete}
          maxImages={5}
          isDisabled={updateForumMutation.isPending}
          label="Gambar Forum (Maks. 5)"
          showExistingImagesLabel="Gambar Tersimpan"
          addNewImagesLabel="Tambah Gambar Baru"
        />

        {/* Categories Selection */}
        <View style={styles.inputGroup}>
          <StyledText style={styles.label} weight="medium">
            Kategori
          </StyledText>
          <View style={styles.categoriesContainer}>
            {categories.map(category => {
              if (
                category.id === ALL_FORUM_CATEGORY_PLACEHOLDER.id ||
                category.id === MY_FORUM_CATEGORY_PLACEHOLDER.id
              ) {
                return null;
              }
              const isSelected = formData.categories.includes(category.id);
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCheckbox,
                    isSelected && styles.categoryCheckboxSelected,
                  ]}
                  onPress={() => toggleCategory(category.id)}>
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxSelected,
                      ]}>
                      {isSelected && (
                        <CustomIcon
                          name="Check"
                          size={12}
                          color={COLORS.white}
                        />
                      )}
                    </View>
                    <StyledText
                      style={[
                        styles.categoryText,
                        isSelected && styles.categoryTextSelected,
                      ]}>
                      {category.name}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            updateForumMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={updateForumMutation.isPending}>
          {updateForumMutation.isPending ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <StyledText style={styles.submitButtonText}>
              Perbarui Forum
            </StyledText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: COLORS.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  contentInput: {
    height: 200,
    textAlignVertical: 'top',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCheckbox: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.white,
  },
  categoryCheckboxSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  categoryTextSelected: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForumUpdateScreen;
