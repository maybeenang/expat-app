import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import StyledText from '../common/StyledText';
import COLORS from '../../constants/colors';
import {CustomIcon, IconName} from '../common/CustomPhosporIcon';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

const {width} = Dimensions.get('window');
const BANNER_WIDTH = width - 30;
const BANNER_SPACING = 10;

type BannerItemType = {
  id: string;
  title: string;
  subtitle: string;
  icon: IconName;
  rotate: string;
};

const bannerItem: BannerItemType[] = [
  {
    id: '1',
    title: 'Butuh hiburan?',
    subtitle: 'Lihat event seru di bulan ini',
    icon: 'Ticket',
    rotate: '-30deg',
  },
  {
    id: '2',
    title: 'Liburan Mau Kemana?',
    subtitle: 'Explore rekomendasi penginapan dari kami',
    icon: 'Compass',
    rotate: '0deg',
  },
];

interface HomeBannerItemProps {
  item: BannerItemType;
}

const HomeBannerItem = ({item}: HomeBannerItemProps) => {
  return (
    <TouchableOpacity activeOpacity={0.9}>
      <LinearGradient
        colors={['#4166F7', '#AF3B93', '#CD774D']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.bannerContainer}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <StyledText style={styles.bannerTitle}>{item.title}</StyledText>
            <StyledText style={styles.bannerSubtitle}>
              {item.subtitle}
            </StyledText>
          </View>
          <TouchableOpacity style={styles.bannerButton} activeOpacity={0.7}>
            <StyledText style={styles.bannerButtonText}>
              Klik untuk baca selengkapnya
            </StyledText>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.bannerIconContainer,
            {
              transformOrigin: 'center',
              transform: [
                {
                  rotate: item.rotate,
                },
              ],
            },
          ]}>
          <CustomIcon
            name={item.icon}
            size={48}
            color={COLORS.white}
            type="fill"
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const HomeBannerList = () => {
  return (
    <View style={styles.bannerOuterContainer}>
      <FlatList
        horizontal
        data={bannerItem}
        renderItem={({item}) => <HomeBannerItem item={item} />}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={BANNER_WIDTH + BANNER_SPACING}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={styles.bannerListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerOuterContainer: {
    marginVertical: 15,
  },
  bannerListContainer: {
    paddingHorizontal: 15,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    flexGrow: 1,
    marginRight: BANNER_SPACING,
  },
  bannerContent: {
    flex: 1,
    marginRight: 15,
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  bannerTextContainer: {
    marginBottom: 15,
  },
  bannerTitle: {
    fontSize: 20,
    fontFamily: 'Roboto-Bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: COLORS.white,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#6A1B9A',
    fontFamily: 'Roboto-Medium',
    fontSize: 13,
  },
  bannerIconContainer: {
    opacity: 0.9,
  },
});

export default HomeBannerList;
