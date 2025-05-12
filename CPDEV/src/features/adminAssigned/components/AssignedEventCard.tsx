import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AssignedEvent} from '../types/adminAssigned';
import {colors, fonts, numbers} from '../../../contants/styles';
import {formatDate} from 'date-fns';

interface AssignedEventCardProps {
  event: AssignedEvent;
  onPress: (eventId: string) => void; // Aksi saat kartu ditekan (mis. lihat detail event)
}

const AssignedEventCard: React.FC<AssignedEventCardProps> = ({
  event,
  onPress,
}) => {
  const getCrewDisplayNames = (listCrewsString: string | null): string => {
    if (!listCrewsString) return 'Belum ada Crew';
    return listCrewsString
      .split(',')
      .map(crewInfo => crewInfo.trim())
      .join('\n');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(event.id)}
      activeOpacity={0.7}
      accessibilityLabel={`View details for event ${
        event.client_names
      } on ${formatDate(event.event_date, 'dd MMMM yyyy')}`}>
      <View style={styles.header}>
        <Text style={styles.eventDate}>
          {formatDate(event.event_date, 'EEEE, dd MMM yyyy')}
        </Text>
        <View
          style={[
            styles.areaBadge,
            {
              backgroundColor: event.area
                ? colors.primaryVariant
                : colors.greyLight,
            },
          ]}>
          <Text
            style={[
              styles.areaText,
              {color: event.area ? colors.white : colors.textDisabled},
            ]}>
            {event.area || 'N/A'}
          </Text>
        </View>
      </View>

      <Text style={styles.clientNames}>{event.client_names}</Text>
      <Text style={styles.location}>
        Lokasi: {event.location_ceremony || 'Belum ditentukan'}
      </Text>

      <View style={styles.separator} />

      <Text style={styles.detailLabel}>Assigned Crew :</Text>
      <Text style={styles.detailValue}>
        {getCrewDisplayNames(event.list_crews)}
      </Text>

      <Text style={styles.detailLabel}>Perusahaan:</Text>
      <Text style={styles.detailValue}>{event.company_name || 'N/A'}</Text>

      <View style={styles.footer}>
        <Text style={styles.coverage}>
          Coverage: {event.coverage_by || 'N/A'}
        </Text>
        <Text style={styles.totalContract}>
          ${Number(event.hutang_gaji_karyawan || 0).toLocaleString('en-US')}
        </Text>
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
    marginBottom: numbers.padding,
    borderWidth: 1,
    borderColor: colors.border,
    // shadowColor: colors.shadow,
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: numbers.padding / 2,
  },
  eventDate: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  areaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: numbers.borderRadius / 2,
  },
  areaText: {
    fontSize: 11,
    fontFamily: fonts.medium,
    textTransform: 'uppercase',
  },
  clientNames: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: numbers.padding / 2,
  },
  location: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
    marginBottom: numbers.padding,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: numbers.padding * 0.75,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginTop: numbers.padding / 2,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    marginBottom: numbers.padding / 3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: numbers.padding,
    paddingTop: numbers.padding / 2,
    borderTopWidth: 1,
    borderTopColor: colors.greyLight,
  },
  coverage: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textSecondary,
  },
  totalContract: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.primary,
  },
  // chevron: {
  //   position: 'absolute',
  //   right: numbers.padding,
  //   top: '50%', // Atur agar di tengah vertikal kartu
  //   transform: [{ translateY: -12 }], // Setengah dari ukuran ikon
  // },
});

export default React.memo(AssignedEventCard);
