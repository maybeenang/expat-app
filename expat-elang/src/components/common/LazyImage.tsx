import React, {useState} from 'react';
import {
  Image,
  ImageProps,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import COLORS from '../../constants/colors';
import SkeletonLoader from './SkeletonLoader';

interface LazyImageProps extends Omit<ImageProps, 'source'> {
  source: {uri: string};
  placeholderColor?: string;
  showLoadingIndicator?: boolean;
}

const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  placeholderColor = COLORS.greyLight,
  showLoadingIndicator = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <View style={[styles.container, style]}>
      {isLoading && (
        <View style={[styles.placeholder, {backgroundColor: placeholderColor}]}>
          {showLoadingIndicator && (
            <ActivityIndicator size="small" color={COLORS.primary} />
          )}
        </View>
      )}
      <Image
        {...props}
        source={source}
        style={[styles.image, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LazyImage; 