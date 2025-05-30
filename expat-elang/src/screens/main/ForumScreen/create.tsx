import React, {useState} from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import StyledText from '../../../components/common/StyledText';
import {CustomIcon} from '../../../components/common/CustomPhosporIcon';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ALL_FORUM_CATEGORY_PLACEHOLDER,
  MY_FORUM_CATEGORY_PLACEHOLDER,
  useCreateForumMutation,
  useForumCategoriesQuery,
} from '../../../hooks/useForumQuery';
import {CreateForumPayload} from '../../../types/forum';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import ImageSelectionManager, {
  EnhancedImageAsset,
  prepareImagesForSubmission,
} from '../../../components/common/ImageSelectionManager';
import RichTextEditor from '../../../components/common/RichTextEditor';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumCreate'>;

interface ForumFormData {
  title: string;
  content: string;
  categories: string[];
}

const ForumCreateScreen = ({navigation}: Props) => {
  const [formData, setFormData] = useState<ForumFormData>({
    title: '',
    content: '',
    categories: [],
  });
  const [enhancedImages, setEnhancedImages] = useState<EnhancedImageAsset[]>(
    [],
  );

  const createForumMutation = useCreateForumMutation();
  const {data: categories = []} = useForumCategoriesQuery();

  const {show, hide} = useLoadingOverlayStore();

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
        prepareImagesForSubmission(enhancedImages);

      const payload: CreateForumPayload = {
        forum_title: formData.title,
        forum_content: formData.content,
        images: imagesToUpload,
        category: formData.categories,
        imege_title: imageInfo.titles, // Note: This matches the API type which has a typo
        image_alt: imageInfo.alts,
        is_feature: featureImageId,
      };

      show();
      try {
        await createForumMutation.mutateAsync(payload);
      } catch (e) {
        console.log('Error creating forum:', e);
      } finally {
        hide();
      }

      Alert.alert('Success', 'Forum berhasil dibuat', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.log('Error creating forum:', error);
      Alert.alert('Error', 'Gagal membuat forum. Silakan coba lagi.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView style={styles.container}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <StyledText style={styles.label}>Judul Forum</StyledText>
            <TextInput
              style={styles.input}
              readOnly={createForumMutation.isPending}
              placeholder="Masukkan judul forum"
              placeholderTextColor={COLORS.greyDark}
              value={formData.title}
              onChangeText={text =>
                setFormData(prev => ({...prev, title: text}))
              }
            />
          </View>

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <StyledText style={styles.label}>Konten Forum</StyledText>
            <RichTextEditor
              initialContent={formData.content}
              disabled={createForumMutation.isPending}
              onContentChange={html => {
                setFormData(prev => ({...prev, content: html}));
              }}
            />
          </View>

          {/* Image Selection Manager */}
          <ImageSelectionManager
            selectedImages={enhancedImages}
            onImagesChange={setEnhancedImages}
            maxImages={5}
            isDisabled={createForumMutation.isPending}
            label="Gambar Forum (Maks. 5)"
            addNewImagesLabel="Tambah Gambar"
          />

          {/* Categories Selection */}
          <View style={styles.inputGroup}>
            <StyledText style={styles.label}>Kategori</StyledText>
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
                    disabled={createForumMutation.isPending}
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
              createForumMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={createForumMutation.isPending}>
            {createForumMutation.isPending ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <StyledText style={styles.submitButtonText}>
                Buat Forum
              </StyledText>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
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

export default ForumCreateScreen;
