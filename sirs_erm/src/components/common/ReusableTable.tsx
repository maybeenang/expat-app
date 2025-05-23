import React, {useState, useMemo} from 'react';
import {StyleSheet, View, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {DataTable, Text, useTheme, IconButton} from 'react-native-paper';
import {numbers, colors, fonts} from '../../contants/styles';

const screenWidth = Dimensions.get('window').width;

export type Column<T> = {
  id: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: number;
};

type PaginationInfo = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type ReusableTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowPress?: (item: T) => void;
  emptyMessage?: string;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  showSequenceNumber?: boolean;
};

export function ReusableTable<T>({
  columns,
  data,
  isLoading,
  onRowPress,
  emptyMessage = 'Tidak ada data',
  pagination,
  onPageChange,
  showSequenceNumber = true,
}: ReusableTableProps<T>) {
  const theme = useTheme();
  const [page, setPage] = useState(0);

  const rowsPerPage = pagination?.itemsPerPage || 10;
  const from = pagination
    ? (pagination.currentPage - 1) * rowsPerPage
    : page * rowsPerPage;
  const to = pagination
    ? Math.min(pagination.currentPage * rowsPerPage, pagination.totalItems)
    : Math.min((page + 1) * rowsPerPage, data.length);

  const handlePageChange = (newPage: number) => {
    if (pagination && onPageChange) {
      onPageChange(newPage);
    } else {
      setPage(newPage);
    }
  };

  const totalPages =
    pagination?.totalPages || Math.ceil(data.length / rowsPerPage);
  const totalItems = pagination?.totalItems || data.length;
  const currentPage = pagination?.currentPage || page + 1;

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 3; // Show at most 3 page numbers
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Pagination header */}
      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          Showing {rowsPerPage} per page
        </Text>

        <View style={styles.paginationControls}>
          <IconButton
            icon="chevron-left"
            size={20}
            disabled={currentPage <= 1}
            onPress={() => handlePageChange(currentPage - 1)}
          />
          
          {pageNumbers.map(pageNum => (
            <TouchableOpacity
              key={pageNum}
              onPress={() => handlePageChange(pageNum)}
              style={[
                styles.pageButton,
                currentPage === pageNum && styles.activePageButton,
              ]}>
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === pageNum && styles.activePageButtonText,
                ]}>
                {pageNum}
              </Text>
            </TouchableOpacity>
          ))}
          
          <IconButton
            icon="chevron-right"
            size={20}
            disabled={currentPage >= totalPages}
            onPress={() => handlePageChange(currentPage + 1)}
          />
        </View>
      </View>

      {/* Table with horizontal scroll */}
      <ScrollView overScrollMode="never" nestedScrollEnabled={true} horizontal>
        <View style={styles.tableWrapper}>
          {/* Fixed Table Header */}
          <DataTable style={styles.table}>
            <DataTable.Header style={styles.fixedHeader}>
              {showSequenceNumber && (
                <DataTable.Title
                  style={[styles.columnHeader, {width: 50}]}>
                  <Text style={styles.headerText}>No</Text>
                </DataTable.Title>
              )}
              {columns.map((column, index) => (
                <DataTable.Title
                  numberOfLines={2}
                  key={index}
                  style={[styles.columnHeader, {width: column.width || 150}]}>
                  <Text style={styles.headerText}>{column.label}</Text>
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
                // Empty state
                <DataTable.Row>
                  <DataTable.Cell
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.cellText}>{emptyMessage}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ) : (
                // Data rows
                data.map((item, index) => (
                  <DataTable.Row
                    key={index}
                    onPress={() => onRowPress?.(item)}
                    style={onRowPress ? styles.pressableRow : undefined}>
                    {showSequenceNumber && (
                      <DataTable.Cell style={[styles.cell, {width: 50}]}>
                        <Text style={styles.cellText}>
                          {from + index + 1}
                        </Text>
                      </DataTable.Cell>
                    )}
                    {columns.map((column, colIndex) => (
                      <DataTable.Cell
                        key={colIndex}
                        style={[styles.cell, {width: column.width || 175}]}>
                        {column.render ? (
                          column.render(item)
                        ) : (
                          <Text style={styles.cellText}>
                            {String(item[column.id] ?? '-')}
                          </Text>
                        )}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    padding: numbers.padding,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: colors.greyLight,
  },
  columnHeader: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  scrollableTable: {
    flex: 1,
  },
  cell: {
    padding: 8,
  },
  cellText: {
    flexWrap: 'wrap',
    fontSize: 12,
  },
  pressableRow: {
    backgroundColor: colors.white,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paginationText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  pagination: {
    flex: 1,
    justifyContent: 'flex-end',
    marginStart: 4,
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activePageButton: {
    backgroundColor: colors.primary,
  },
  pageButtonText: {
    fontSize: 14,
  },
  activePageButtonText: {
    color: colors.white,
  },
});

