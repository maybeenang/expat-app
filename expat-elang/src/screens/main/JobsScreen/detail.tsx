import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../navigation/types';
import Icon from '@react-native-vector-icons/ionicons';
import COLORS from '../../../constants/colors';
import {useJobDetailQuery} from '../../../hooks/useJobsQuery';

type Props = NativeStackScreenProps<RootStackParamList, 'JobDetail'>;

// Helper Komponen untuk Baris Info
interface InfoRowProps {
  iconName: string;
  label: string;
  value: string | null | undefined;
  link?: string | null | undefined;
}

const InfoRow: React.FC<InfoRowProps> = ({iconName, label, value, link}) => {
  if (!value) {
    return null;
  }

  const handlePress = () => {
    if (link) {
      openUrl(link); // Panggil helper untuk buka link
    }
  };

  return (
    <TouchableOpacity
      style={styles.infoRowContainer}
      onPress={handlePress}
      disabled={!link}
      activeOpacity={link ? 0.7 : 1}>
      <Icon
        name={iconName}
        size={18}
        color={COLORS.textSecondary}
        style={styles.infoRowIcon}
      />
      <View>
        <Text style={styles.infoRowLabel}>{label}</Text>
        <Text style={[styles.infoRowValue, link && styles.infoRowLink]}>
          {value}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const JobDetailScreen = ({route}: Props) => {
  const {jobId, categoryId} = route.params;
  const {
    data: job,
    isLoading,
    error,
    refetch,
  } = useJobDetailQuery({
    jobId,
    categoryId,
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }
  if (error || !job) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Gagal memuat detail: {error?.message || 'Data tidak ditemukan.'}
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Render Detail ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Header Info Perusahaan */}
        <View style={styles.companyHeader}>
          <Image
            source={{
              uri:
                job.logoUrl ??
                'https://via.placeholder.com/80/cccccc/969696?text=L',
            }}
            style={styles.companyLogo}
            resizeMode="contain"
          />
          <View style={styles.companyHeaderText}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <TouchableOpacity
              onPress={() => openUrl(job.companyWebsite)}
              disabled={!job.companyWebsite}>
              <Text
                style={[
                  styles.companyName,
                  !!job.companyWebsite && styles.companyNameLink,
                ]}>
                {job.companyName}
              </Text>
            </TouchableOpacity>
            <Text style={styles.locationText}>
              <Icon
                name="location-sharp"
                size={14}
                color={COLORS.textSecondary}
              />{' '}
              {job.location}
            </Text>
          </View>
        </View>

        {/* Info Detail Pekerjaan */}
        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Icon name="cash-outline" size={20} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Gaji</Text>
            <Text style={styles.detailValue}>
              {job.salaryFormatted ?? 'Tidak Disebutkan'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Diposting</Text>
            <Text style={styles.detailValue}>{job.postDateFormatted}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="timer-outline" size={20} color={COLORS.primary} />
            <Text style={styles.detailLabel}>Kadaluarsa</Text>
            <Text style={styles.detailValue}>{job.expiryDateFormatted}</Text>
          </View>
          {/* Tambah item detail lain jika perlu (tipe pekerjaan, dll) */}
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Deskripsi Pekerjaan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deskripsi Pekerjaan</Text>
          {/* TODO: Gunakan RenderHTML jika deskripsi berupa HTML */}
          <Text style={styles.descriptionText}>
            {job.jobDescription || '-'}
          </Text>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Tentang Perusahaan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tentang {job.companyName}</Text>
          <Text style={styles.descriptionText}>
            {job.companyDescription || '-'}
          </Text>
          <InfoRow
            iconName="globe-outline"
            label="Website"
            value={job.companyWebsite}
            link={job.companyWebsite}
          />
          <InfoRow
            iconName="mail-outline"
            label="Email Kontak"
            value={job.contactEmail}
            link={`mailto:${job.contactEmail}`}
          />
          <InfoRow
            iconName="call-outline"
            label="Telepon Kontak"
            value={job.contactPhone}
            link={`tel:${job.contactPhone}`}
          />
        </View>

        {/* Spacer di bawah */}
        <View style={{height: 30}} />
      </ScrollView>

      {/* Tombol Apply (di luar ScrollView) */}
      <View style={styles.applyButtonContainer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() =>
            openUrl(job.contactWeb ?? `mailto:${job.contactEmail}`)
          } // Coba buka web, fallback ke email
          activeOpacity={0.8}
          disabled={!job.contactWeb && !job.contactEmail}>
          <Text style={styles.applyButtonText}>Lamar Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.white},
  scrollView: {flex: 1},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {color: COLORS.primary, textAlign: 'center', marginBottom: 15},
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {color: COLORS.white, fontFamily: 'Roboto-Medium'},
  // Company Header
  companyHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start', // Align items ke atas
  },
  companyLogo: {
    width: 65,
    height: 65,
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: COLORS.greyLight,
    backgroundColor: COLORS.white,
  },
  companyHeaderText: {
    flex: 1,
  },
  jobTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  companyName: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  companyNameLink: {
    color: COLORS.primary, // Warna link jika ada website
    textDecorationLine: 'underline',
  },
  locationText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    flexDirection: 'row', // Tidak berfungsi di Text, Icon perlu di luar
    alignItems: 'center',
  },
  // Detail Grid
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: COLORS.greyLight + '50', // Background abu sangat muda
    marginHorizontal: 20, // Beri margin horizontal
    borderRadius: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1, // Agar lebar sama
  },
  detailLabel: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  // Separator
  separator: {height: 8, backgroundColor: COLORS.greyLight, marginVertical: 20},
  // Sections (Deskripsi, Tentang Perusahaan)
  section: {
    paddingHorizontal: 20,
    marginBottom: 10, // Jarak antar section kecil
  },
  sectionTitle: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 15,
  },
  descriptionText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  // Info Row for Company Details
  infoRowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Align icon ke atas teks
    marginTop: 15,
  },
  infoRowIcon: {
    marginRight: 12,
    marginTop: 2, // Sesuaikan posisi vertikal ikon
  },
  infoRowLabel: {
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 1,
  },
  infoRowValue: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  infoRowLink: {
    color: COLORS.primary, // Warna link
    textDecorationLine: 'underline',
  },
  // Apply Button
  applyButtonContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    backgroundColor: COLORS.white, // Pastikan background solid
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Roboto-Bold',
  },
});

// --- Helper Link (Pindahkan ke utils/linkHelper.ts) ---
const openUrl = async (url: string | null | undefined) => {
  if (!url) {
    Alert.alert('URL tidak tersedia');
    return;
  }
  try {
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Gagal membuka link');
    console.error('Failed to open URL:', error);
  }
};
// -----------------------------------------------------

export default JobDetailScreen;
