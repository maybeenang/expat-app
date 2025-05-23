import React from 'react';
import {ScrollView, View} from 'react-native';
import {Text} from '../../../../components/common/Text';
import {PieChart} from 'react-native-chart-kit';
import {colors, numbers} from '../../../../contants/styles';
import {FlatList} from 'react-native-gesture-handler';

interface Props {
  chartDataSimrs: any[];
}

const SepTerbuatChart = ({chartDataSimrs}: Props) => {
  const data = [
    {
      charData: chartDataSimrs[0],
      title: 'Jumlah SEP Terbuat di SIMRS/VClaim',
    },
    {
      charData: chartDataSimrs[1],
      title: 'Jumlah SEP Terbuat di Ranap/IGD',
    },
  ];

  return (
    <View>
      <FlatList
        data={data}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginVertical: numbers.margin,
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <>
            <Text
              style={{
                fontSize: 12,
                marginBottom: numbers.margin,
              }}>
              {item.title}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View
                style={{
                  flexDirection: 'row',
                  minWidth: 400,
                }}>
                <PieChart
                  key={'pie-chart-1'}
                  data={item.charData}
                  width={200}
                  height={200}
                  accessor="population"
                  backgroundColor="white"
                  paddingLeft="40"
                  absolute
                  hasLegend={false}
                  chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                />
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  {item.charData.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: numbers.margin,
                      }}>
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: item.color,
                          borderRadius: 10,
                          marginRight: numbers.margin,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textPrimary,
                        }}>
                        {item.population} {item.name} (
                        {item.percentage.toFixed(2)}%)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </>
        )}
      />
    </View>
  );
};

export default SepTerbuatChart;
