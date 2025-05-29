import React from 'react';
import {Alert, StyleSheet, TextInput, View} from 'react-native';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import COLORS from '../../../constants/colors';
import {useForumReplyMutation} from '../../../hooks/useForumQuery';
import {TouchableOpacity} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {ForumReplyPayload} from '../../../types/forum';
import {ActivityIndicator} from 'react-native';

interface Props {
  forumId?: string;
}

const ForumReplyInput = (props: Props) => {
  const mutation = useForumReplyMutation();
  const {control, handleSubmit, reset} = useForm<ForumReplyPayload>();

  const onSubmit = async (data: ForumReplyPayload) => {
    if (!props.forumId) {
      Alert.alert('Forum ID tidak ditemukan');
      return;
    }

    try {
      await mutation.mutateAsync({
        ...data,
        id_forum: props.forumId,
      });

      reset();
    } catch (error) {
      console.error('Error sending reply:', error);
      Alert.alert('Gagal mengirim balasan', 'Silakan coba lagi nanti.');
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <CustomIcon
          name="UserCircle"
          size={36}
          type="fill"
          color={COLORS.greyMedium}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.inputTextContainer}>
          <Controller
            control={control}
            name="reply_content"
            rules={{
              required: 'Email kontak harus diisi',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                cursorColor={COLORS.primary}
                placeholder="Tulis balasan..."
                placeholderTextColor={COLORS.greyMedium}
                multiline
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Fitur ini belum tersedia');
            }}>
            <CustomIcon name="Images" size={25} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
          style={{
            borderRadius: 100,
            backgroundColor: COLORS.primary,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {mutation.isPending ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <CustomIcon name="PaperPlaneRight" size={20} color={COLORS.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 10,
  },
  inputTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: COLORS.greyLight,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
  },
});

export default ForumReplyInput;
