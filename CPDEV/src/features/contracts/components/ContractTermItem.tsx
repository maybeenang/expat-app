import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import RenderHTML, {MixedStyleDeclaration} from 'react-native-render-html';
import {ContractContentItem} from '../types/contract';
import {colors, fonts, numbers, tagsStyles} from '../../../contants/styles';

interface ContractTermItemProps {
  term: ContractContentItem;
  index: number;
}

const ContractTermItem: React.FC<ContractTermItemProps> = ({term, index}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      {term.title_contract_terms && (
        <Text style={styles.title}>{term.title_contract_terms}</Text>
      )}
      <RenderHTML
        contentWidth={
          width -
          numbers.padding * 2 -
          (styles.htmlContainer.paddingHorizontal || 0) * 2
        } // Lebar konten dikurangi padding
        source={{html: term.contract_terms}}
        tagsStyles={tagsStyles}
        enableExperimentalMarginCollapsing // Coba ini jika ada masalah margin
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: numbers.padding,
    backgroundColor: colors.surface, // Warna latar untuk setiap term
  },
  title: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    paddingBottom: numbers.padding / 2,
  },
  htmlContainer: {
    // Tidak digunakan langsung, tapi untuk perhitungan contentWidth
    paddingHorizontal: 0, // Default, jika ada padding di container RenderHTML bisa diatur di sini
  },
});

export default React.memo(ContractTermItem);
