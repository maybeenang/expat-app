import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, fonts} from '../../contants/styles';
import {View} from 'react-native';
import {Text} from './Text';
import IcDocument from '../../assets/icons/ic_document.svg';
import IcNext from '../../assets/icons/ic_next.svg';

interface FeatureButtonProps {
  title: string;
  onPress: () => void;
}

const FeatureButton = ({title, onPress}: FeatureButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <IcDocument width={48} height={48} />

      <View style={[styles.textContainer]}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{fontFamily: fonts.medium}}>
          {title}
        </Text>
      </View>

      <IcNext />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Memberi ruang di antara ikon & teks
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.greyMedium,
  },
});

export default FeatureButton;
