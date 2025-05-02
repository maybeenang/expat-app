import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {CustomIcon} from '../../common/CustomPhosporIcon';
import COLORS from '../../../constants/colors';

const ForumReplyInput = () => {
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
          <TextInput
            style={styles.input}
            cursorColor={COLORS.primary}
            placeholder="Tulis balasan..."
            placeholderTextColor={COLORS.greyMedium}
            multiline
          />
          <CustomIcon name="Images" size={25} color={COLORS.primary} />
        </View>
        <View
          style={{
            borderRadius: 100,
            backgroundColor: COLORS.primary,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomIcon name="PaperPlaneRight" size={20} color={COLORS.white} />
        </View>
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
