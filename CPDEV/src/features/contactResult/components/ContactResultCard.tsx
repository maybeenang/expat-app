import React, {useMemo} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import type {
  ContactResultItem,
  ContactResultDesc,
} from '../types/contactResult';
import {colors, fonts, numbers} from '../../../contants/styles';
import {formatDate} from 'date-fns';
import {CustomIcon} from '../../../components/common/CustomIcon';

interface ContactResultCardProps {
  item: ContactResultItem;
  onPress: (contactResultId: string) => void;
  onActionPress?: (contactResult: ContactResultItem) => void; // Untuk tombol aksi (mis. delete)
}

const ContactResultCard: React.FC<ContactResultCardProps> = ({
  item,
  onPress,
  onActionPress,
}) => {
  // Parse 'desc' string JSON menjadi objek
  const parsedDesc = useMemo((): ContactResultDesc | null => {
    if (!item.desc) {
      return null;
    }
    try {
      return JSON.parse(item.desc) as ContactResultDesc;
    } catch (e) {
      console.error("Failed to parse 'desc' JSON:", e, item.desc);
      return null;
    }
  }, [item.desc]);

  const handleActionPress = (event: any) => {
    event.stopPropagation(); // Mencegah trigger onPress kartu utama
    if (onActionPress) {
      onActionPress(item);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
      accessibilityLabel={`View details for contact result ${item.name1} & ${item.name2}`}>
      {onActionPress && ( // Tombol aksi (mis. delete)
        <TouchableOpacity
          style={styles.actionButtonContainer}
          onPress={handleActionPress}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <CustomIcon
            name="DotsThreeVertical"
            size={20}
            color={colors.primary}
            type="bold"
          />
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <Text style={styles.primaryName}>
          {item.name1 || 'N/A'}
          {item.name2 ? ` & ${item.name2}` : ''}
        </Text>
      </View>

      <View style={styles.header}>
        {item.wedding_date && (
          <Text style={styles.weddingDate}>
            {formatDate(item.wedding_date, 'dd MMM yyyy')}
          </Text>
        )}
      </View>

      <Text style={styles.companyText}>
        {/* <Icon name="domain" size={14} color={colors.textSecondary} />  */}
        Perusahaan: {item.company || 'N/A'}
      </Text>
      {item.area && <Text style={styles.detailText}>Area: {item.area}</Text>}

      {parsedDesc && (
        <View style={styles.descSection}>
          <Text style={styles.detailTextSmall}>
            Paket: {parsedDesc.package || '-'}
          </Text>
          <Text style={styles.detailTextSmall}>
            Lokasi Acara: {parsedDesc.event_location || '-'}
          </Text>
          <Text style={styles.detailTextSmall}>
            Mendengar dari: {parsedDesc.how_did_you_hear || '-'}
          </Text>
          {parsedDesc.instagram && (
            <Text style={styles.detailTextSmall}>
              Instagram: {parsedDesc.instagram}
            </Text>
          )}
        </View>
      )}

      <View style={styles.contactInfo}>
        <View style={styles.contactPerson}>
          <Text style={styles.contactLabel}>Kontak 1:</Text>
          <Text style={styles.contactDetail}>{item.email1 || '-'}</Text>
          <Text style={styles.contactDetail}>{item.cellphone1 || '-'}</Text>
        </View>
        {item.name2 && ( // Tampilkan kontak 2 jika ada
          <View style={styles.contactPerson}>
            <Text style={styles.contactLabel}>Kontak 2:</Text>
            <Text style={styles.contactDetail}>{item.email2 || '-'}</Text>
            <Text style={styles.contactDetail}>{item.cellphone2 || '-'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: numbers.borderRadius,
    padding: numbers.padding,
    marginBottom: numbers.padding,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  actionButtonContainer: {
    position: 'absolute',
    top: numbers.padding / 2,
    right: numbers.padding / 2,
    zIndex: 10,
    padding: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: numbers.padding / 1.5,
  },
  primaryName: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    flex: 1, // Agar bisa wrap jika panjang
    marginRight: 8,
  },
  weddingDate: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  companyText: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: numbers.padding / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  descSection: {
    marginTop: numbers.padding / 1.5,
    paddingTop: numbers.padding / 1.5,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
  },
  detailTextSmall: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactInfo: {
    marginTop: numbers.padding / 1.5,
    paddingTop: numbers.padding / 1.5,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
    flexDirection: 'row', // Untuk kontak 1 dan 2 berdampingan jika muat
    justifyContent: 'space-between',
    gap: numbers.padding / 2, // Jarak antar kolom kontak
  },
  contactPerson: {
    flex: 1, // Agar mengambil ruang yang sama
  },
  contactLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
  },
});

export default React.memo(ContactResultCard);
