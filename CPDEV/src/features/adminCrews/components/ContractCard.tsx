import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Contract} from '../types';
import {colors, fonts, numbers} from '../../../contants/styles';

interface Props {
  contract: Contract;
  onPress?: (contract: Contract) => void;
}

const ContractCard: React.FC<Props> = ({contract, onPress}) => {
  return (
    <TouchableOpacity
      key={contract.id}
      style={styles.contractCard}
      onPress={() => {
        if (contract) {
          onPress?.(contract);
        }
      }}>
      <Text style={styles.contractNumber}>No: {contract.contract_number}</Text>
      <Text style={styles.companyName}>
        Perusahaan: {contract.company_name}
      </Text>
      <Text style={styles.detailLabel}>
        Tgl Dibuat: {new Date(contract.created_date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contractCard: {
    backgroundColor: colors.greyLight,
    borderRadius: numbers.borderRadius / 2,
    padding: numbers.padding / 1.5,
    marginBottom: numbers.padding / 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contractNumber: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
  },
  companyName: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.greyDark,
    marginTop: 4,
  },
});
export default React.memo(ContractCard);
