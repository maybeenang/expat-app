import {Dimensions} from 'react-native';
import {MixedStyleDeclaration} from 'react-native-render-html';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

export const colors = {
  primary: '#007AFF',
  primaryVariant: '#61ADFF',
  primaryLight: '#61ADFF',
  primaryDisabled: '#61ADFF',
  secondary: '#03dac6',
  secondaryVariant: '#018786',
  background: '#f5f5f5',
  surface: '#ffffff',
  error: '#b00020',
  textPrimary: '#262626',
  textSecondary: '#888888',
  textDisabled: '#9e9e9e',
  border: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.2)',

  white: '#FFFFFF',
  black: '#000000',
  greyLight: '#F8F8F8',
  greyMedium: '#CCCCCC',
  greyDark: '#A9A9A9',
  greyDrawerItem: '#ECEFF3',
  neutralLight: '#F5F5F5',

  // debug
  red: '#FF0000',
};

export const COLORS = colors;

export const numbers = {
  borderRadius: 8,
  borderWidth: 1,
  shadowRadius: 4,
  padding: 16,
  width: width,
  headerWidth: width - width * 0.16,
  height: height,
  margin: 16,
};

export const fonts = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
};

export const DRAWERICONOPTIONS = {
  size: 24,
  color: colors.primary,
};

export const tagsStyles: Readonly<Record<string, MixedStyleDeclaration>> = {
  body: {
    // Gaya default untuk seluruh konten HTML
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 22,
    textAlign: 'justify',
  },
  p: {
    marginBottom: 10,
    marginTop: 5,
  },
  strong: {
    fontFamily: fonts.bold,
    fontWeight: 'bold',
  },
  ul: {
    marginLeft: 20,
    marginBottom: 10,
  },
  ol: {
    marginLeft: 20,
    marginBottom: 10,
  },
  li: {
    marginBottom: 5,
  },
  // Tambahkan tag lain sesuai kebutuhan
};
