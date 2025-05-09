import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {AdminCrew} from '../types';
import {colors, fonts, numbers} from '../../../contants/styles';

interface AdminCrewCardProps {
  crew: AdminCrew;
  onPress: (crewId: string) => void;
}

const AdminCrewCard: React.FC<AdminCrewCardProps> = ({crew, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(crew.id)}
      activeOpacity={0.7}
      accessibilityLabel={`View details for ${crew.name}`}
      accessibilityRole="button">
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{crew.name}</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    // shadowColor: colors.shadow,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  infoContainer: {
    flex: 1,
    marginRight: numbers.padding / 2,
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
    flexDirection: 'row', // Untuk ikon inline jika ada
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
    color: colors.primary, // Menonjolkan role
  },
  contractsInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: numbers.padding / 2,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    minWidth: 60, // Agar ukuran konsisten
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
  // chevron: {
  //   marginLeft: numbers.padding / 2,
  // },
});

export default React.memo(AdminCrewCard); // Gunakan React.memo untuk optimasi
