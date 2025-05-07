import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, Dimensions, Text} from 'react-native';
import {DataTable} from 'react-native-paper';
import {COLORS} from '../constants/COLORS';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';
import he from 'he';

const screenWidth = Dimensions.get('window').width;

const AppDataTable = ({data, columns, rowsPerPage = 10}) => {
  const [page, setPage] = useState(0);
  const from = page * rowsPerPage;
  const to = Math.min((page + 1) * rowsPerPage, data.length);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <View style={styles.paginationContainer}>
          <Text style={[TEXT_STYLES.text12, styles.paginationText]}>
            Showing {rowsPerPage} per page
          </Text>

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(data.length / rowsPerPage)}
            onPageChange={newPage => setPage(newPage)}
            label={`${from + 1}-${to} of ${data.length}`}
            style={styles.pagination}
          />
        </View>
      ) : (
        <View />
      )}

      {/* Horizontal Scroll for Table */}
      <ScrollView overScrollMode="never" nestedScrollEnabled={true} horizontal>
        <View style={styles.tableWrapper}>
          {/* Fixed Table Header */}
          <DataTable style={styles.table}>
            <DataTable.Header style={[styles.fixedHeader]}>
              {columns.map((column, index) => (
                <DataTable.Title
                  numberOfLines={2}
                  key={index}
                  style={[styles.columnHeader, {width: column.width || 150}]}>
                  <Text style={[TEXT_STYLES.text12, styles.headerText]}>
                    {column.label}
                  </Text>
                </DataTable.Title>
              ))}
            </DataTable.Header>
          </DataTable>

          {/* Scrollable Data Rows */}
          <ScrollView
            overScrollMode="never"
            nestedScrollEnabled={true}
            style={styles.scrollableTable}>
            <DataTable style={styles.table}>
              {data.length === 0 ? (
                // Show a single row when there's no data
                <DataTable.Row>
                  <DataTable.Cell
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={[TEXT_STYLES.text12, styles.cellText]}>
                      Tidak ada data
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ) : (
                // Render normal data rows
                data.slice(from, to).map((row, rowIndex) => (
                  <DataTable.Row key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <DataTable.Cell
                        key={colIndex}
                        style={[styles.cell, {width: column.width || 150}]}>
                        <Text style={[TEXT_STYLES.text12, styles.cellText]}>
                          {he.decode((row[column.field] ?? '-').toString())}
                        </Text>
                      </DataTable.Cell>
                    ))}
                  </DataTable.Row>
                ))
              )}
            </DataTable>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paginationText: {
    color: COLORS.text500,
  },
  pagination: {
    flex: 1,
    justifyContent: 'flex-end',
    marginStart: 4,
  },
  tableWrapper: {
    overflow: 'hidden',
    minWidth: screenWidth,
  },
  table: {
    width: '100%',
    minWidth: screenWidth,
  },
  fixedHeader: {
    backgroundColor: COLORS.text50,
  },
  columnHeader: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    textAlign: 'center',
    fontFamily: 'inter_medium',
  },
  scrollableTable: {},
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  cellText: {
    textAlign: 'center',
    flexWrap: 'wrap',
  },
});

export default AppDataTable;
