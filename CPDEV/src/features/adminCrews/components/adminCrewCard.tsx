// src/features/adminCrews/components/AdminCrewCard.tsx

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {AdminCrew} from '../types';
import {colors, fonts, numbers} from '../../../contants/styles';
import {CustomIcon} from '../../../components/common/CustomIcon';

interface AdminCrewCardProps {
  crew: AdminCrew;
  onPress: (crewId: string) => void;
  onActionPress?: (crew: AdminCrew) => void; // Prop baru untuk tombol aksi
  actionIconElement?: React.ReactNode; // Ikon kustom untuk tombol aksi
  // actionIconName?: string; // Atau nama ikon jika menggunakan library
}

const AdminCrewCard: React.FC<AdminCrewCardProps> = ({
  crew,
  onPress,
  onActionPress,
  actionIconElement,
  // actionIconName = 'dots-vertical', // Default ikon jika pakai nama
}) => {
  const handleActionPress = () => {
    if (onActionPress) {
      onActionPress(crew);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(crew.id)}
      activeOpacity={0.7}
      accessibilityLabel={`View details for ${crew.name}`}
      accessibilityRole="button">
      {/* Tombol Aksi di Kanan Atas */}
      {onActionPress && (
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={handleActionPress} // Gunakan handler yang sudah ada stopPropagation
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}} // Memperluas area sentuh
          accessibilityLabel={`Actions for ${crew.name}`}
          accessibilityRole="button">
          {actionIconElement ? (
            actionIconElement
          ) : (
            <CustomIcon name="DotsThreeVertical" />
          )}
        </TouchableOpacity>
      )}

      <View style={styles.mainContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
            {crew.name}
          </Text>
          <Text style={styles.detailText}>
            {/* <Icon name="email-outline" size={14} color={colors.textSecondary} />  */}
            Email: {crew.email.trim()}
          </Text>
          <Text style={styles.detailText}>
            {/* <Icon name="phone-outline" size={14} color={colors.textSecondary} />  */}
            Telp: {crew.cell_number}
          </Text>
          <Text style={styles.role}>
            Role: <Text style={styles.roleValue}>{crew.role}</Text>
          </Text>
        </View>

        <View style={styles.contractsInfo}>
          <Text style={styles.contractsCount}>{crew.contracts.length}</Text>
          <Text style={styles.contractsLabel}>Kontrak</Text>
        </View>
      </View>
      {/* <Icon name="chevron-right" size={24} color={colors.greyMedium} style={styles.chevron} /> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: numbers.borderRadius,
    padding: numbers.padding,
    marginBottom: numbers.padding / 2,
    // flexDirection: 'row', // Dihapus, mainContent akan handle ini
    // justifyContent: 'space-between', // Dihapus
    // alignItems: 'center', // Dihapus
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative', // Diperlukan untuk positioning absolut tombol aksi
  },
  actionButtonContainer: {
    position: 'absolute',
    top: numbers.padding / 2, // Sesuaikan posisi
    right: numbers.padding / 2, // Sesuaikan posisi
    zIndex: 1, // Pastikan di atas konten lain jika ada overlap
    padding: 4, // Padding di sekitar ikon agar mudah disentuh
    // backgroundColor: 'rgba(0,0,0,0.05)', // Opsional: background tipis untuk debug area sentuh
    // borderRadius: 20, // Opsional: jika ingin background bulat
  },
  mainContent: {
    // Wrapper baru untuk konten utama agar bisa disejajarkan dengan tombol aksi
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: numbers.padding / 1.5, // Beri sedikit ruang lebih jika ada kontrak info
    paddingRight: numbers.padding / 1.5, // Padding agar nama tidak terlalu mepet tombol aksi jika sangat panjang
  },
  name: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  role: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginTop: 4,
  },
  roleValue: {
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  contractsInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: numbers.padding / 2,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    minWidth: 60,
  },
  contractsCount: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  contractsLabel: {
    fontSize: 10,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
});

export default React.memo(AdminCrewCard);
