import React from 'react';
import {Image, ImageProps, StyleSheet, View} from 'react-native';
import {colors} from '../../contants/styles';

interface AvatarProps extends Omit<ImageProps, 'source'> {
  size?: number;
  source?: ImageProps['source'];
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 40,
  source,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}>
      <Image
        source={source || {uri: 'https://via.placeholder.com/150'}}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    resizeMode: 'cover',
  },
});

