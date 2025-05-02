import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../../constants/colors';
import StyledText from '../../../components/common/StyledText';
import {CustomIcon} from '../../../components/common/CustomPhosporIcon';
import {launchImageLibrary} from 'react-native-image-picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ALL_FORUM_CATEGORY_PLACEHOLDER,
  MY_FORUM_CATEGORY_PLACEHOLDER,
  useAdminForumDetailQuery,
  useForumCategoriesQuery,
  useUpdateForumMutation,
} from '../../../hooks/useForumQuery';
import {UpdateForumPayload} from '../../../types/forum';
import {RootStackParamList} from '../../../navigation/types';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';

type Props = NativeStackScreenProps<RootStackParamList, 'ForumUpdate'>;

interface ForumFormData {
  title: string;
  content: string;
  images: string[];
  categories: string[];
}

const ForumUpdateScreen = ({navigation, route}: Props) => {
  const {forumId} = route.params;
  const [formData, setFormData] = useState<ForumFormData>({
    title: '',
    content: '',
    images: [],
    categories: [],
  });

  const {show, hide} = useLoadingOverlayStore();

  const updateForumMutation = useUpdateForumMutation();
  const {data: categories = []} = useForumCategoriesQuery();

  const {data: forumDetail, isLoading} = useAdminForumDetailQuery(forumId);

  useEffect(() => {
    if (forumDetail) {
      hide();
      const forum = forumDetail;
      setFormData({
        title: forum.mainTopic.title,
        content: forum.mainTopic.contentHTML,
        images: [],
        categories: forum.mainTopic.categories.map(cat => {
          return categories.filter(c => c.name === cat)[0]?.id || '';
        }),
      });
    } else {
      show();
    }

    return () => {
      setFormData({
        title: '',
        content: '',
        images: [],
        categories: [],
      });
    };
  }, [forumDetail, categories, show, hide]);

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 5,
        includeBase64: true,
      });

      if (result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri || '');
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...newImages],
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

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
      const imageFiles = formData.images.map((uri, index) => ({
        uri,
        type: 'image/jpeg',
        name: `forum_image_${index}.jpg`,
      }));

      const payload: UpdateForumPayload = {
        id: forumId,
        forum_title: formData.title,
        forum_content: formData.content,
        images: imageFiles,
        category: formData.categories,
      };

      show();
      try {
        await updateForumMutation.mutateAsync(payload);
      } catch (e) {
        console.log('Update Error:', e);
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

        {/* Image Upload */}
        <View style={styles.inputGroup}>
          <StyledText style={styles.label} weight="medium">
            Gambar
          </StyledText>
          <StyledText style={[styles.label, {fontSize: 12}]}>
            Edit hanya bisa menambahkan gambar
          </StyledText>
          <View style={styles.imageContainer}>
            {formData.images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{uri}} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}>
                  <CustomIcon name="X" color={COLORS.white} size={16} />
                </TouchableOpacity>
              </View>
            ))}
            {formData.images.length < 5 && (
              <TouchableOpacity
                style={styles.addImageButton}
                onPress={handleImagePick}>
                <CustomIcon name="Plus" color={COLORS.primary} size={24} />
              </TouchableOpacity>
            )}
          </View>
        </View>

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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  imageWrapper: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.red,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
