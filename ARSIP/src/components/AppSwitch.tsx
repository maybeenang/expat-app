import React, {useState} from 'react';
import {Switch, View, Text, StyleSheet} from 'react-native';
import {COLORS} from '../constants/COLORS';
import {TEXT_STYLES} from '../constants/TEXT_STYLES';

interface AppSwitchProps {
  onToggle?: (value: boolean) => void;
  initialState?: boolean;
  labels?: {on: string; off: string};
  showLabel?: boolean; // Tambahkan properti opsional
}

const AppSwitch: React.FC<AppSwitchProps> = ({
  onToggle,
  initialState = false,
  labels = {on: 'Grafik', off: 'Grafik'},
  showLabel = true, // Default: label ditampilkan
}) => {
  const [isEnabled, setIsEnabled] = useState(initialState);

  const handleToggle = (value: boolean) => {
    setIsEnabled(value);
    if (onToggle) {
      onToggle(value);
    }
  };

  return (
    <View style={styles.container}>
      {showLabel && ( // Hanya tampil jika showLabel = true
        <Text style={[TEXT_STYLES.text10, {color: COLORS.grey}]}>
          {isEnabled ? labels.on : labels.off}
        </Text>
      )}
      <Switch
        trackColor={{false: COLORS.fieldBorder, true: COLORS.blue}}
        thumbColor={isEnabled ? COLORS.white : COLORS.grey2}
        onValueChange={handleToggle}
        value={isEnabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});

export default AppSwitch;
