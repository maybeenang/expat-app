import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useForm} from 'react-hook-form';
import DatePicker from 'react-native-date-picker';
import {Dropdown} from 'react-native-element-dropdown';
import {SepTerbuatListParams} from '../../../../types/sepTerbuat';
import {StyledButton} from '../../../../components/common';
import {colors, fonts, numbers} from '../../../../contants/styles';

interface SepTerbuatFilterProps {
  initialParams?: SepTerbuatListParams;
  onFilterChange: (params: SepTerbuatListParams) => void;
}

interface FilterFormData {
  filter: 'hari' | 'bulan' | 'range' | 'tahun';
  range_start?: string;
  range_end?: string;
  date?: string;
  month?: string;
  year?: string;
  code_diag_awal: string;
  jns_pelayanan: number;
  search: string;
}

const filterOptions = [
  {label: 'Hari', value: 'hari'},
  {label: 'Bulan', value: 'bulan'},
  {label: 'Range', value: 'range'},
  {label: 'Tahun', value: 'tahun'},
];

const monthOptions = Array.from({length: 12}, (_, i) => ({
  label: `${i + 1}`.padStart(2, '0'),
  value: `${i + 1}`.padStart(2, '0'),
}));

const yearOptions = Array.from({length: 5}, (_, i) => {
  const year = new Date().getFullYear() - 2 + i;
  return {label: year.toString(), value: year.toString()};
});

const jnsPelayananOptions = [
  {label: 'Rawat Inap', value: 2},
  {label: 'Rawat Jalan', value: 1},
];

export const SepTerbuatFilter: React.FC<SepTerbuatFilterProps> = ({
  onFilterChange,
  initialParams,
}) => {
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {handleSubmit, watch, setValue} = useForm<FilterFormData>({
    defaultValues: initialParams,
  });

  const selectedFilter = watch('filter');
  const getDateFromString = (dateStr: string | undefined): Date => {
    if (!dateStr) return new Date();
    try {
      return new Date(dateStr);
    } catch {
      return new Date();
    }
  };

  const rangeStart = watch('range_start');
  const rangeEnd = watch('range_end');
  const date = watch('date');

  const onSubmit = (data: FilterFormData) => {
    const params: SepTerbuatListParams = {
      filter: data.filter,
      deleted: 'active',
      limit: 10,
      code_diag_awal: data.code_diag_awal,
      jns_pelayanan: data.jns_pelayanan,
      search: data.search,
    };

    switch (data.filter) {
      case 'range':
        params.range_start = data.range_start;
        params.range_end = data.range_end;
        break;
      case 'hari':
        params.date = data.date;
        break;
      case 'bulan':
        params.month = data.month;
        params.year = data.year;
        break;
      case 'tahun':
        params.year = data.year;
        break;
    }

    onFilterChange(params);
  };

  const renderDateInputs = () => {
    switch (selectedFilter) {
      case 'range':
        return (
          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Tanggal Mulai</Text>
              <StyledButton
                title={watch('range_start') || 'Pilih Tanggal'}
                onPress={() => setShowStartDatePicker(true)}
                variant="outline"
              />
            </View>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Tanggal Akhir</Text>
              <StyledButton
                title={watch('range_end') || 'Pilih Tanggal'}
                onPress={() => setShowEndDatePicker(true)}
                variant="outline"
              />
            </View>
          </View>
        );
      case 'hari':
        return (
          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <Text style={styles.label}>Tanggal</Text>
              <StyledButton
                title={watch('date') || 'Pilih Tanggal'}
                onPress={() => setShowDatePicker(true)}
                variant="outline"
              />
            </View>
          </View>
        );
      case 'bulan':
        return (
          <View style={styles.dateContainer}>
            <View style={styles.dateInputContainer}>
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Bulan</Text>
                <Dropdown
                  data={monthOptions}
                  labelField="label"
                  valueField="value"
                  value={watch('month')}
                  onChange={item => setValue('month', item.value)}
                  style={styles.dropdown}
                  placeholder="Pilih Bulan"
                />
              </View>
              <View style={styles.dropdownContainer}>
                <Text style={styles.label}>Tahun</Text>
                <Dropdown
                  data={yearOptions}
                  labelField="label"
                  valueField="value"
                  value={watch('year')}
                  onChange={item => setValue('year', item.value)}
                  style={styles.dropdown}
                  placeholder="Pilih Tahun"
                />
              </View>
            </View>
          </View>
        );
      case 'tahun':
        return (
          <View style={styles.dropdownContainer}>
            <Text style={styles.label}>Tahun</Text>
            <Dropdown
              data={yearOptions}
              labelField="label"
              valueField="value"
              value={watch('year')}
              onChange={item => setValue('year', item.value)}
              style={styles.dropdown}
              placeholder="Pilih Tahun"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Jenis Filter</Text>
        <Dropdown
          data={filterOptions}
          labelField="label"
          valueField="value"
          value={watch('filter')}
          onChange={item => setValue('filter', item.value)}
          style={styles.dropdown}
          placeholder="Pilih Jenis Filter"
        />
      </View>

      {renderDateInputs()}

      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Jenis Pelayanan</Text>
        <Dropdown
          data={jnsPelayananOptions}
          labelField="label"
          valueField="value"
          value={watch('jns_pelayanan')}
          onChange={item => setValue('jns_pelayanan', item.value)}
          style={styles.dropdown}
          placeholder="Pilih Jenis Pelayanan"
        />
      </View>

      <StyledButton
        title="Terapkan Filter"
        onPress={handleSubmit(onSubmit)}
        style={styles.button}
      />

      <DatePicker
        modal
        mode="date"
        open={showStartDatePicker}
        date={getDateFromString(rangeStart)}
        onConfirm={(val: Date) => {
          setValue('range_start', val.toISOString().split('T')[0]);
          setShowStartDatePicker(false);
        }}
        onCancel={() => setShowStartDatePicker(false)}
      />

      <DatePicker
        modal
        mode="date"
        open={showEndDatePicker}
        date={getDateFromString(rangeEnd)}
        onConfirm={(val: Date) => {
          setValue('range_end', val.toISOString().split('T')[0]);
          setShowEndDatePicker(false);
        }}
        onCancel={() => setShowEndDatePicker(false)}
      />

      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        date={getDateFromString(date)}
        onConfirm={(val: Date) => {
          setValue('date', val.toISOString().split('T')[0]);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: numbers.padding,
  },
  label: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: numbers.margin,
  },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: numbers.borderRadius,
    paddingHorizontal: numbers.padding,
    backgroundColor: colors.white,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: numbers.margin,
    marginBottom: numbers.margin,
  },
  dateInputContainer: {
    flex: 1,
  },
  button: {
    marginTop: numbers.margin,
  },
});
