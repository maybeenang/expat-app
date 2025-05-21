import React from 'react';
import {Text, StyleSheet, Dimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import COLORS from '../../../constants/colors';
import {htmlStyles, isHtml, formatPlainText} from '../../../utils/htmlUtils';

interface ContentRendererProps {
  content: string;
  numberOfLines?: number;
  style?: any;
}

const {width} = Dimensions.get('window');

const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  numberOfLines,
  style,
}) => {
  if (isHtml(content)) {
    return (
      <RenderHTML
        contentWidth={width - 40} // Account for padding
        source={{html: content}}
        tagsStyles={htmlStyles}
        enableExperimentalMarginCollapsing={true}
      />
    );
  }

  return (
    <Text style={[styles.plainText, style]} numberOfLines={numberOfLines}>
      {formatPlainText(content)}
    </Text>
  );
};

const styles = StyleSheet.create({
  plainText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
});

export default ContentRenderer; 