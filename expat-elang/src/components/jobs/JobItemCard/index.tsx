// src/components/JobItemCard.tsx (Buat/Perbarui)
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProcessedJobItem} from '../../../types/jobs';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';

interface JobItemCardProps {
  item: ProcessedJobItem;
}

const JobItemCard = React.memo(({item}: JobItemCardProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Asumsi detail di RootStack

  const handlePress = () => {
    // TODO: Implementasi navigasi ke JobDetail
    console.log('Navigate to job detail:', item.slug);
    // navigation.navigate('JobDetail', { jobId: item.id });
  };

  const defaultLogo = 'https://via.placeholder.com/50/cccccc/969696?text=L'; // Placeholder logo

  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={handlePress}
      activeOpacity={0.8}>
      <View style={styles.header}>
        <Image
          source={{uri: item.logoUrl ?? defaultLogo}}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {item.companyName}
          </Text>
        </View>
        {/* Tag Paid/Free (Opsional) */}
        {/* <View style={[styles.paidTag, !item.isPaid && styles.freeTag]}>
                    <Text style={styles.paidTagText}>{item.isPaid ? 'Paid' : 'Free'}</Text>
                 </View> */}
      </View>
      <View style={styles.body}>
        <View style={styles.infoRow}>
          <Icon
            name="location-outline"
            size={14}
            color={COLORS.textSecondary}
            style={styles.infoIcon}
          />
          <Text style={styles.infoText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>
        {item.salaryFormatted && (
          <View style={styles.infoRow}>
            <Icon
              name="cash-outline"
              size={14}
              color={COLORS.textSecondary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>{item.salaryFormatted}</Text>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.dateText}>{item.postDateFormatted}</Text>
        {/* Bisa tambahkan tombol Apply atau Save di sini */}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: COLORS.greyLight, // Background jika gambar transparan/gagal load
  },
  headerText: {
    flex: 1, // Agar teks bisa memanjang dan tag tetap di kanan (jika ada)
  },
  title: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  company: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // paidTag: { ... style untuk tag ... },
  // freeTag: { ... style untuk tag ... },
  // paidTagText: { ... style untuk tag ... },
  body: {
    marginBottom: 10,
    paddingLeft: 5, // Sedikit indentasi untuk info
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 13,
    color: COLORS.textSecondary,
    flexShrink: 1, // Agar bisa wrap jika panjang
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.greyLight,
    paddingTop: 10,
    alignItems: 'flex-end', // Tampilkan tanggal di kanan
  },
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default JobItemCard;
