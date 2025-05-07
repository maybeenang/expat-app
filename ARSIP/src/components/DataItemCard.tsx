import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {COLORS} from '../constants/COLORS';
import IcDocument from '../assets/icons/ic_document.svg';

const DataItemCard = ({title, badges, date, id}) => {
  return (
    <View>
      <View style={styles.container}>
        {/* Row with Icon and Title */}
        <View style={styles.titleRow}>
          <IcDocument style={styles.icon} />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, TEXT_STYLES.text14Medium]}>
              {title}
            </Text>

            {/* Badges as a vertical list */}
            <View style={styles.badgeContainer}>
              {badges.map((badge, index) => (
                <View key={index} style={styles.badgeRow}>
                  <Text style={[TEXT_STYLES.text12, styles.badgeLabel]}>
                    {badge.label}
                  </Text>
                  <Text style={[TEXT_STYLES.text12, styles.badgeValue]}>
                    {badge.value}
                  </Text>
                </View>
              ))}
            </View>

            <Text style={[TEXT_STYLES.text12, styles.date]}>{date}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.fieldBorder,
    borderRadius: 10,
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  badgeContainer: {
    // marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  badgeLabel: {
    flex: 1,
  },
  badgeValue: {},
  date: {
    color: '#9E9E9E',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

export default DataItemCard;
