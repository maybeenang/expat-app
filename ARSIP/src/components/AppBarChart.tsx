import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {STYLES} from '../constants/STYLES';

const AppBarChart = ({
  data,
  dataKey,
  label,
  barColor = 'rgba(66, 135, 245, 1)',
  yAxisLabel = 'Jumlah',
  barPercentage = 1,
}) => {
  const labels = data.map(item => item.label);
  const values = data.map(item => Number(item[dataKey]) || 0);

  console.log('labels', labels);
  console.log('values', values);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `${barColor}`,
        label,
      },
    ],
    legend: [label],
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `${barColor}`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: barPercentage,
    propsForBackgroundLines: {
      strokeDasharray: '1',
    },
  };

  return (
    <ScrollView horizontal>
      <View style={[STYLES.mt20, styles.chartContainer]}>
        {/* Y-axis Label */}
        <Text style={styles.yAxisLabel}>{yAxisLabel}</Text>

        <View>
          {/* Legend on top */}
          <View style={styles.legendWrapper}>
            <View
              style={[styles.legendItem, {backgroundColor: `${barColor}`}]}
            />
            <Text style={styles.legendLabel}>{label}</Text>
          </View>

          {/* Bar Chart */}
          <BarChart
            data={chartData}
            width={labels.length === 1 ? 320 : labels.length * 60}
            height={400}
            yAxisLabel=""
            fromZero
            showValuesOnTopOfBars
            chartConfig={chartConfig}
            verticalLabelRotation={90}
            withInnerLines
            yAxisSuffix=""
            yAxisInterval={10}
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
    marginBottom: 10,
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

export default AppBarChart;
