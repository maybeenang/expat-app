import {MixedStyleDeclaration} from 'react-native-render-html';
import COLORS from './colors';

export const htmlStyles: Readonly<Record<string, MixedStyleDeclaration>> = {
  p: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 16, // Jarak antar paragraf
  },
  strong: {
    fontFamily: 'Roboto-Bold',
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'none',
    fontFamily: 'Roboto-Regular',
  },
  ul: {
    marginBottom: 16,
  },
  li: {
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  h1: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textPrimary,
  },
  h2: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
  blockquote: {
    fontFamily: 'Roboto-Italic',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textSecondary,
    marginBottom: 16,
    paddingLeft: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  h3: {
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    lineHeight: 26,
    color: COLORS.textPrimary,
  },
};
