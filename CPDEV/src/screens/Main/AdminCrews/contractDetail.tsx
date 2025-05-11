import React, {useLayoutEffect} from 'react'; // Tambahkan useRef, useState, useCallback
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  TextStyle,
} from 'react-native';
import {RootStackParamList} from '../../../navigation/types'; // Sesuaikan path
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScreenContainer, StyledButton} from '../../../components/common'; // Sesuaikan path
import EmptyListComponent from '../../../components/common/EmptyListComponent';
import {colors, fonts, numbers} from '../../../contants/styles';
import UniversalHeaderTitle from '../../../components/common/UniversalHeaderTitle';
import {formatDate} from '../../../utils/helpers';
import ContractTermItem from '../../../features/contracts/components/ContractTermItem';
import {useContractDetailQuery} from '../../../features/contracts/hooks/useContractQuery';

const tagsStyles = {
  p: {marginVertical: 5, fontFamily: fonts.regular, lineHeight: 20},
};

interface Props
  extends NativeStackScreenProps<
    RootStackParamList,
    'AdminCrewContractDetail' // Pastikan nama rute ini benar di RootStackParamList
  > {}

const AdminCrewContractDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const {contract, crewName, companyName} = route.params;

  const {
    data: contractDetail,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useContractDetailQuery(contract.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <UniversalHeaderTitle
          title={`Kontrak: ${contractDetail?.contract_number || 'Detail'}`}
        />
      ),
    });
  }, [navigation, contractDetail?.contract_number]);

  if (isLoading) {
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent isLoading message="Memuat detail kontrak..." />
      </ScreenContainer>
    );
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

  if (!contractDetail) {
    // Anda mungkin ingin menggunakan query detail kontrak di sini agar bisa refetch
    return (
      <ScreenContainer style={styles.centerContainer}>
        <EmptyListComponent
          isLoading
          message="Detail kontrak tidak tersedia."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <View style={styles.section}>
          <Text style={styles.headerTitleMain}>
            INDEPENDENT CONTRACTOR MASTER AGREEMENT
          </Text>
          <Text style={styles.headerTitleRef}>
            Ref no : {contractDetail.contract_number}
          </Text>
          <Text style={styles.paragraph}>
            This Independent Contractor Agreement ("Agreement") is entered into
            as of {formatDate(contractDetail.created_date)} between
            <Text style={styles.boldText}> {companyName} </Text>
            ("Studio") and
            <Text style={styles.boldText}> {crewName} </Text>
            ("Contractor").
          </Text>

          {contractDetail.contracts && contractDetail.contracts.length > 0 ? (
            contractDetail.contracts.map((term, index) => (
              <ContractTermItem
                key={term.id_contract_terms || index.toString()} // Pastikan key unik
                term={term}
                index={index}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>
              Tidak ada isi kontrak tersedia.
            </Text>
          )}

          <View style={styles.agreementFooter}>
            <Text style={tagsStyles.p as TextStyle}>
              Contractor and Studio have read and agree to all terms, conditions
              and provisions of this Agreement
            </Text>
            <Text style={tagsStyles.p as TextStyle}>
              Dated: {formatDate(contractDetail.created_date)}
            </Text>
          </View>

          <View style={styles.signatureSection}>
            {/* Kolom Tanda Tangan Kru */}
            <View style={styles.signatureColumn}>
              <Text style={styles.signaturePartyNameLeft}>{crewName}</Text>
              {contractDetail.crew_signature ? (
                <Image
                  source={{uri: contractDetail.crew_signature}}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              ) : (
                <>
                  <Text style={styles.signaturePlaceholderLeft}>
                    Belum ditandatangani
                  </Text>
                  <StyledButton // Ganti StyledButton
                    title="TTD Kru"
                    onPress={() => {
                      navigation.navigate('SignaturePadScreen', {
                        signatureType: 'CREW',
                        relatedCrewId: contractDetail.id_users,
                        entityId: contractDetail.id,
                      });
                    }}
                    size="small"
                    style={styles.signatureButton}
                  />
                </>
              )}
            </View>

            {/* Kolom Tanda Tangan Admin/Perusahaan */}
            <View style={styles.signatureColumn}>
              <Text style={styles.signaturePartyNameRight}>{companyName}</Text>
              {contractDetail.admin_signature ? (
                <Image
                  source={{uri: contractDetail.admin_signature}}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              ) : (
                <>
                  <Text style={styles.signaturePlaceholderRight}>
                    Belum ditandatangani
                  </Text>
                  {/* Tombol TTD Admin bisa ditambahkan di sini jika diperlukan oleh flow admin */}
                  {/* <Button
                    title="TTD Admin"
                    onPress={() => openSignatureSheet('ADMIN')}
                    size="small"
                    style={styles.signatureButton}
                  /> */}
                </>
              )}
            </View>
          </View>

          <Text style={styles.agreementEndNote}>
            ~ End Master Independent Contractor Agreement ~
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {flex: 1, backgroundColor: colors.background},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: numbers.padding,
  },
  scrollContentContainer: {paddingBottom: numbers.padding * 2}, // Beri ruang di bawah
  section: {
    backgroundColor: colors.surface,
    padding: numbers.padding,
    borderRadius: numbers.borderRadius, // Tambahkan border radius untuk section
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitleMain: {
    fontSize: 18,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: numbers.padding / 2,
  },
  headerTitleRef: {
    fontSize: 16,
    fontFamily: fonts.medium,
    textAlign: 'center',
    marginBottom: numbers.padding,
  },
  paragraph: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'justify',
    marginBottom: numbers.padding,
    lineHeight: 20,
  },
  boldText: {fontFamily: fonts.bold},
  agreementFooter: {
    marginTop: numbers.padding * 1.5,
    paddingTop: numbers.padding,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
  },
  noDataText: {
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: numbers.padding,
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: numbers.padding * 1.5,
    paddingTop: numbers.padding,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
    minHeight: 150 /* Beri tinggi minimal */,
  },
  signatureColumn: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: numbers.padding / 2,
  },
  signaturePartyNameLeft: {
    fontFamily: fonts.medium,
    textAlign: 'left',
    width: '100%',
    marginBottom: numbers.padding / 2,
    minHeight: 36,
  },
  signaturePartyNameRight: {
    fontFamily: fonts.medium,
    textAlign: 'right',
    width: '100%',
    marginBottom: numbers.padding / 2,
    minHeight: 36,
  },
  signatureImage: {
    width: '90%',
    height: 100, // Sesuaikan ukuran gambar tanda tangan
    // backgroundColor: colors.greyLight, // Background jika gambar transparan
    borderWidth: 1,
    borderColor: colors.border,
  },
  signaturePlaceholderLeft: {
    textAlign: 'left',
    width: '100%',
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
    minHeight: 70 /* Sesuaikan agar sejajar*/,
  },
  signaturePlaceholderRight: {
    textAlign: 'right',
    width: '100%',
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
    minHeight: 70 /* Sesuaikan agar sejajar*/,
  },
  signatureButton: {marginTop: 'auto', width: '100%'}, // Tombol mengisi lebar kolomnya
  agreementEndNote: {
    fontSize: 12,
    fontFamily: fonts.bold,
    textAlign: 'left',
    marginTop: numbers.padding * 1.5,
    paddingTop: numbers.padding,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
  },

  // Styles untuk konten BottomSheet tanda tangan
  signatureContentContainer: {
    flex: 1,
    padding: numbers.padding,
    justifyContent: 'space-between',
  },
  canvasInnerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: numbers.borderRadius,
    marginBottom: numbers.padding,
    overflow: 'hidden' /* penting untuk border radius pada webview canvas */,
  },
  signatureActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: numbers.padding,
  },
  signatureActionButton: {flex: 1, marginHorizontal: numbers.padding / 2},
});

export default AdminCrewContractDetailScreen;
