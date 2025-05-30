import {MixedStyleDeclaration} from 'react-native-render-html';
import COLORS from '../constants/colors';

// HTML styles for better rendering
export const htmlStyles: Record<string, MixedStyleDeclaration> = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontFamily: 'Roboto-Regular',
  },
  p: {
    marginBottom: 10,
  },
  strong: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.textPrimary,
  },
  ul: {
    marginBottom: 10,
  },
  ol: {
    marginBottom: 10,
  },
  li: {
    marginBottom: 5,
  },
  a: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    paddingLeft: 10,
    marginLeft: 0,
    marginBottom: 10,
  },
  code: {
    backgroundColor: COLORS.greyLight,
    padding: 5,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  pre: {
    backgroundColor: COLORS.greyLight,
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
};

// Helper function to detect if content is HTML
export const isHtml = (content: string): boolean => {
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(content);
};

// Helper function to format plain text with proper line breaks
export const formatPlainText = (text: string): string => {
  if (!text) return '';
  return text
    .split('\\n')
    .map(line => line.trim())
    .join('\n');
};

