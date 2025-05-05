// src/components/JobItemCard.tsx (Buat/Perbarui)
import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ProcessedJobItem} from '../../../types/jobs';
import {RootStackParamList} from '../../../navigation/types';
import COLORS from '../../../constants/colors';
import Icon from '@react-native-vector-icons/ionicons';
import {CustomIcon} from '../../common/CustomPhosporIcon';

interface JobItemCardProps {
  item: ProcessedJobItem;
  categoryId?: string;
  showActionButton?: boolean;
  handleActionButtonPress: () => void;
}

const JobItemCard = React.memo(
  ({
    item,
    categoryId,
    showActionButton = false,
    handleActionButtonPress,
  }: JobItemCardProps) => {
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handlePress = () => {
      navigation.navigate('JobDetail', {jobId: item.id, categoryId});
    };

    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={handlePress}
        activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.company} numberOfLines={1}>
              {item.companyName}
            </Text>
          </View>
          {showActionButton && (
            <TouchableOpacity
              style={{alignSelf: 'flex-start'}}
              onPress={() => handleActionButtonPress()}>
              <CustomIcon
                name="DotsThreeVertical"
                size={24}
                color={COLORS.textPrimary}
              />
            </TouchableOpacity>
          )}
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
          <View
            style={[
              styles.infoRow,
              {alignItems: 'center', justifyContent: 'space-between'},
            ]}>
            {item.salaryFormatted && (
              <View style={styles.infoRow}>
                <Icon
                  name="cash-outline"
                  size={14}
                  color={COLORS.primary}
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoText, {color: COLORS.primary}]}>
                  {item.salaryFormatted}
                </Text>
              </View>
            )}

            <Text style={styles.dateText}>{item.postDateFormatted}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 15,
    borderWidth: 0.5,
    borderColor: COLORS.greyDrawerItem,
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
  },
  company: {
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  body: {},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dateText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default JobItemCard;
