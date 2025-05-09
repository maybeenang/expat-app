import React from 'react';
import {ContractDetailData} from '../types/contract';
import {Text, View} from 'react-native';

interface Props {
  contract: ContractDetailData;
}

const ContractSignatureTemplate: React.FC<Props> = ({contract}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#000',
      }}>
      <View>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{contract.name}</Text>
      </View>

      <View>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>{contract.name}</Text>
      </View>
    </View>
  );
};

export default ContractSignatureTemplate;
