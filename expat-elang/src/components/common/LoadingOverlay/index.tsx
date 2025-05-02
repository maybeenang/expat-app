import {
  ActivityIndicator,
  StyleSheet,
  View,
  Modal,
  Dimensions,
} from 'react-native';
import {useLoadingOverlayStore} from '../../../store/useLoadingOverlayStore';
import {memo} from 'react';

const {width, height} = Dimensions.get('window');

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
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(LoadingOverlay);
