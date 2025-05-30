import React from 'react';
import {Dimensions} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {htmlStyles} from '../../../utils/htmlUtils';

interface ContentRendererProps {
  content: string;
  numberOfLines?: number;
  style?: any;
}

const {width} = Dimensions.get('window');

const ContentRenderer: React.FC<ContentRendererProps> = ({content}) => {
  return (
    <RenderHTML
      contentWidth={width - 40} // Account for padding
      source={{html: content}}
      tagsStyles={htmlStyles}
      enableExperimentalMarginCollapsing={true}
    />
  );
};

export default ContentRenderer;

