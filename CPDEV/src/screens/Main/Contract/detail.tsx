import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextStyle,
} from 'react-native';
import {RootStackParamList} from '../../../navigation/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useContractDetailQuery} from '../../../features/contracts/hooks/useContractQuery';
import {ScreenContainer} from '../../../components/common';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {colors, fonts, numbers, tagsStyles} from '../../../contants/styles';
import DetailRow from '../../../components/common/DetailRow';
import ContractTermItem from '../../../features/contracts/components/ContractTermItem';
import {formatDate} from '../../../utils/helpers';

interface Props
  extends NativeStackScreenProps<RootStackParamList, 'ContractDetail'> {}

const ContractDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {contractId} = route.params;

  const {
    data: contractDetail,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContractDetailQuery(contractId);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: isLoading
        ? 'Memuat Detail Kontrak...'
        : contractDetail?.contract_number,
    });
  }, [navigation, contractDetail, isLoading]);

  if (isLoading && !isFetching) {
    // Hanya loading awal, bukan refresh
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent isLoading message="Memuat detail kontrak..." />
      </ScreenContainer>
    );
  }

  if (isError) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent
          message={`Error: ${error?.message || 'Gagal memuat detail kontrak.'}`}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      </ScreenContainer>
    );
  }

  if (!contractDetail) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent isLoading message="Memuat detail kontrak..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {isFetching && !isLoading && (
          <Text style={styles.fetchingText}>Menyegarkan data...</Text>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Utama Kontrak</Text>
          <DetailRow
            label="Nomor Kontrak"
            value={contractDetail.contract_number}
          />
          <DetailRow
            label="Tanggal Dibuat"
            value={formatDate(contractDetail.created_date)}
          />
          <DetailRow label="ID Perusahaan" value={contractDetail.id_company} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Kru</Text>
          <DetailRow label="Nama Kru" value={contractDetail.name} />
          <DetailRow label="Email" value={contractDetail.email} />
          <DetailRow label="No. Telepon" value={contractDetail.cell_number} />
          <DetailRow label="Role" value={contractDetail.role} />
          <DetailRow
            label="Tgl Tidak Tersedia"
            value={formatDate(contractDetail.unavailable_date)}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Isi Kontrak</Text>
          {contractDetail.contracts && contractDetail.contracts.length > 0 ? (
            contractDetail.contracts.map((term, index) => (
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tanda Tangan</Text>
          <DetailRow
            label="TTD Kru"
            value={contractDetail.crew_signature || 'Belum ditandatangani'}
          />
          <DetailRow
            label="Tanggal TTD Kru"
            value={formatDate(contractDetail.crew_signature_date)}
          />
          <DetailRow
            label="TTD Admin"
            value={contractDetail.admin_signature || 'Belum ditandatangani'}
          />
          <DetailRow
            label="Tanggal TTD Admin"
            value={formatDate(contractDetail.admin_signature_date)}
          />
        </View>

        {/* Tombol Aksi Tambahan (Contoh) 
        <View style={styles.actionsContainer}>
          <StyledButton
            title="Setujui Kontrak (Kru)"
            onPress={() => Alert.alert('TODO: Setujui (Kru)')}
            style={{marginBottom: 10}}
          />
          <StyledButton
            title="Setujui Kontrak (Admin)"
            variant="outlinePrimary"
            onPress={() => Alert.alert('TODO: Setujui (Admin)')}
          />
        </View>
      */}
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
  scrollContentContainer: {
    paddingVertical: numbers.padding,
  },
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

export default ContractDetailScreen;
