import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TextStyle,
} from 'react-native';
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer} from '../../../components/common';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {colors, fonts, numbers, tagsStyles} from '../../../contants/styles';
import ContractTermItem from '../../../features/contracts/components/ContractTermItem';
import {formatDate} from '../../../utils/helpers';

interface Props
  extends NativeStackScreenProps<
    RootStackParamList,
    'AdminCrewContractDetail'
  > {}

const AdminCrewContractDetailScreen: React.FC<Props> = ({route}) => {
  const {contract: contractDetail, crewName} = route.params;

  if (!contractDetail) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent isLoading message="Memuat detail kontrak..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.section}>
          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.bold,
              textAlign: 'center',
              marginBottom: numbers.padding,
            }}>
            INDEPENDENT CONTRACTOR MASTER AGREEMENT
          </Text>

          <Text
            style={{
              fontSize: 18,
              fontFamily: fonts.bold,
              textAlign: 'center',
              marginBottom: numbers.padding,
            }}>
            Ref no : {contractDetail.contract_number}
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.regular,
              textAlign: 'justify',
              marginBottom: numbers.padding,
            }}>
            This Independent Contractor Agreement ("Agreement") is entered into
            as of {formatDate(contractDetail.created_date)} between{' '}
            <Text style={{fontFamily: fonts.bold}}>
              {' '}
              {contractDetail.company_name}{' '}
            </Text>
            ("Studio") and
            <Text style={{fontFamily: fonts.bold}}> {crewName} </Text>
            ("Contractor").
          </Text>

          {contractDetail.isi_kontrak &&
          contractDetail.isi_kontrak.length > 0 ? (
            contractDetail.isi_kontrak.map((term, index) => (
              <ContractTermItem
                key={term.id_contract_terms || index}
                term={term}
                index={index}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>
              Tidak ada isi kontrak tersedia.
            </Text>
          )}
          <View>
            <Text style={tagsStyles.p as TextStyle}>
              Contractor and Studio have read and agree to all terms, conditions
              and provisions of this Agreement
            </Text>
            <Text style={tagsStyles.p as TextStyle}>
              Dated: {formatDate(contractDetail.created_date)}
            </Text>
          </View>
          {/*make row signature*/}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={{textAlign: 'left', minHeight: 36}}>{crewName}</Text>
              {contractDetail.crew_signature ? (
                <Image
                  source={{uri: contractDetail.crew_signature}}
                  width={numbers.width / 2}
                  height={100}
                />
              ) : (
                <Text style={{textAlign: 'left'}}>Belum ditandatangani</Text>
              )}
            </View>

            <View style={{flex: 1}}>
              <Text style={{textAlign: 'right', minHeight: 36}}>
                {contractDetail.company_name}
              </Text>
              {contractDetail.admin_signature ? (
                <Image
                  source={{uri: contractDetail.admin_signature}}
                  width={100}
                  height={100}
                />
              ) : (
                <Text style={{textAlign: 'right'}}>Belum ditandatangani</Text>
              )}
            </View>
          </View>

          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.bold,
              textAlign: 'left',
              marginVertical: numbers.padding,
            }}>
            ~ End Master Independent Contractor Agreement ~
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: numbers.padding,
  },
  scrollContentContainer: {},
  statusText: {
    marginTop: 10,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontSize: 14,
  },
  fetchingText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginBottom: numbers.padding,
    fontSize: 12,
  },
  section: {
    backgroundColor: colors.surface,
    padding: numbers.padding,
    marginBottom: numbers.padding,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: numbers.padding,
    paddingBottom: numbers.padding / 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  noDataText: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: numbers.padding,
  },
  actionsContainer: {
    marginTop: numbers.padding,
    paddingHorizontal: numbers.padding / 2, // Agar tombol tidak terlalu mepet tepi
  },
});

export default AdminCrewContractDetailScreen;
