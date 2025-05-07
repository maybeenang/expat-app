import React from 'react';
import {View, Text, FlatList, ScrollView, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-chart-kit';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import {STYLES} from '../constants/STYLES';

const ChartList = ({data}) => {
  const processChartData = chartData => {
    const colors = [
      '#FF6384',
      '#36A2EB',
      '#FFCE56',
      '#4CAF50',
      '#F44336',
      '#9C27B0',
      '#FF9800',
      '#008080',
      '#800000',
      '#FFD700',
      '#4682B4',
      '#DC143C',
      '#8A2BE2',
      '#00CED1',
      '#FF4500',
    ];

    return chartData
      .filter(entry => parseFloat(entry.value) > 0)
      .map((entry, index) => ({
        name: entry.label,
        population: parseFloat(entry.value),
        percentage: parseFloat(entry.value),
        color: colors[index % colors.length],
        legendFontColor: '#000',
        legendFontSize: 14,
      }));
  };

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.key}
      scrollEnabled={false}
      renderItem={({item}) => {
        const chartData = processChartData(item.data_grafik);

        return (
          <View style={styles.chartContainer}>
            <Text
              style={[
                TEXT_STYLES.text14SemiBold,
                STYLES.mt12,
                STYLES.mb14,
                STYLES.taCenter,
              ]}>
              {item.judul_grafik}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={styles.chartRow}>
                <PieChart
                  data={chartData}
                  width={250}
                  height={250}
                  chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="40"
                  absolute
                  hasLegend={false}
                />
                <View style={styles.legendContainer}>
                  {chartData.map((entry, index) => (
                    <View key={index} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColorBox,
                          {backgroundColor: entry.color},
                        ]}
                      />
                      <Text style={styles.legendText}>
                        ({entry.percentage}%) {entry.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 400,
  },
  legendContainer: {
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColorBox: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#000',
  },
});

export default ChartList;
