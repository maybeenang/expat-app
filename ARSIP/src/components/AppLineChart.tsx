import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {STYLES} from '../constants/STYLES';

const AppLineChart = ({
  data,
  dataKey,
  label,
  color = 'rgba(66, 135, 245, 1)', // default color
}) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => Number(item[dataKey]) || 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => color,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => color,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  return (
    <ScrollView horizontal>
      <View style={[STYLES.mt20, styles.chartContainer]}>
        {/* Y-axis Label */}
        <Text style={styles.yAxisLabel}>Jumlah</Text>

        <View>
          {/* Legend on top */}
          <View style={styles.legendWrapper}>
            <View style={[styles.legendItem, {backgroundColor: color}]} />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>

          {/* Line Chart */}
          <LineChart
            data={chartData}
            width={labels.length * 60}
            height={460}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={chartConfig}
            bezier
            verticalLabelRotation={90}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabel: {
    transform: [{rotate: '-90deg'}],
    marginBottom: 80,
    fontSize: 14,
  },
  legendWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
  },
  legendItem: {
    width: 12,
    height: 12,
    marginRight: 6,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 14,
    color: '#000',
  },
});

export default AppLineChart;
