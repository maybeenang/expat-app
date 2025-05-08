import {ActivityIndicator, StyleSheet, View, Modal} from 'react-native';
import {memo} from 'react';
import {useLoadingOverlayStore} from '../../store/useLoadingOverlayStore';
import {numbers} from '../../contants/styles';

const LoadingOverlay = () => {
  const isLoading = useLoadingOverlayStore(state => state.isLoading);

  return (
    <Modal visible={isLoading} animationType="fade">
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    width: numbers.width,
    height: numbers.height,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(LoadingOverlay);
