import React, {useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {RichText, Toolbar, useEditorBridge} from '@10play/tentap-editor';
import COLORS from '../../constants/colors';

interface RichTextEditorProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  editorHeight?: number;
  disabled?: boolean;
}

const RichTextEditor = ({
  initialContent,
  editorHeight = 400,
  disabled = false,
  onContentChange,
}: RichTextEditorProps) => {
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent,
    dynamicHeight: true,
    onChange: async () => {
      if (onContentChange) {
        const content = await editor.getHTML();
        onContentChange(content);
      }
    },
  });

  if (!editor) {
    // Tampilkan loading atau null selagi editor diinisialisasi
    return <Text>Loading editor...</Text>;
  }

  return (
    <View style={styles.container}>
      <Toolbar editor={editor} />
      <View
        style={[
          styles.editorContainer,
          {height: editorHeight},
          disabled && styles.disabled,
        ]}>
        <RichText editor={editor} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  editorContainer: {
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  disabled: {
    backgroundColor: COLORS.greyLight,
    opacity: 0.7,
  },
});

export default RichTextEditor;

