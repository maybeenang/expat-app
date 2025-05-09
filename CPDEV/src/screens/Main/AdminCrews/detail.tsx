import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {RootStackParamList} from '../../../navigation/types';
import {useAdminCrewDetailQuery} from '../../../features/adminCrews/hooks/useAdminCrewsQuery';
import {ScreenContainer} from '../../../components/common';
import {colors, fonts, numbers} from '../../../contants/styles';
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import ContractCard from '../../../features/adminCrews/components/ContractCard';
import {Contract} from '../../../features/adminCrews/types';

interface Props
  extends NativeStackScreenProps<RootStackParamList, 'AdminCrewDetail'> {}

const AdminCrewDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {crewId} = route.params;

  const {
    data: crew,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminCrewDetailQuery(crewId);

  const handlePressContract = (contract: Contract) => {
    navigation.navigate('AdminCrewContractDetail', {
      contract: contract,
      crewName: crew?.name,
    });
  };

  React.useLayoutEffect(() => {
    if (crew) {
      navigation.setOptions({title: crew.name});
    } else if (isLoading) {
      navigation.setOptions({title: 'Memuat Detail Kru...'});
    } else {
      navigation.setOptions({title: 'Detail Kru'});
    }
  }, [navigation, crew, isLoading]);

  if (isLoading) {
    return <EmptyListComponent isLoading message="Memuat detail kru..." />;
  }

  if (isError) {
    return (
      <ScreenContainer>
        <EmptyListComponent
          message={`Error: ${error?.message || 'Gagal memuat data.'}`}
          onRefresh={refetch}
          refreshing={isFetching}
        />
      </ScreenContainer>
    );
  }

  if (!crew) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.loadingText}>Tidak ada data kru ditemukan.</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {isFetching && !isLoading && (
          <Text style={styles.fetchingText}>Menyegarkan data...</Text>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informasi Dasar</Text>
          <Text style={styles.label}>Nama:</Text>
          <Text style={styles.value}>{crew.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{crew.email.trim()}</Text>
          <Text style={styles.label}>Nomor Telepon:</Text>
          <Text style={styles.value}>{crew.cell_number}</Text>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.valueRole}>{crew.role}</Text>
          {crew.unavailable_date && (
            <>
              <Text style={styles.label}>Tanggal Tidak Tersedia:</Text>
              <Text style={styles.value}>
                {new Date(crew.unavailable_date).toLocaleDateString()}
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Kontrak ({crew.contracts.length})
          </Text>
          {crew.contracts.length > 0 ? (
            crew.contracts.map(contract => (
              <ContractCard
                contract={contract}
                key={contract.id}
                onPress={() => handlePressContract(contract)}
              />
            ))
          ) : (
            <Text style={styles.value}>Tidak ada kontrak.</Text>
          )}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: numbers.padding,
  },
  contentContainer: {
    paddingTop: numbers.padding,
  },
  loadingText: {
    marginTop: 10,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  errorText: {
    fontFamily: fonts.medium,
    color: colors.error,
    textAlign: 'center',
    fontSize: 16,
  },
  fetchingText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: 'gray',
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
    marginBottom: numbers.padding / 1.5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: numbers.padding / 2,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginTop: numbers.padding / 2,
  },
  value: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    marginBottom: numbers.padding / 3,
  },
  valueRole: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: numbers.padding / 3,
  },
});

export default AdminCrewDetailScreen;
