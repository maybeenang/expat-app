// src/components/AdItemCard.tsx (Buat file baru)
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {ProcessedAdItem} from '../../../types/jobs';

interface AdItemCardProps {
  item: ProcessedAdItem;
}

const AdItemCard = React.memo(({item}: AdItemCardProps) => {
  const handlePress = async () => {
    if (!item.externalUrl) return; // Jangan lakukan apa-apa jika tidak ada URL

    try {
      const supported = await Linking.canOpenURL(item.externalUrl);
      if (supported) {
        await Linking.openURL(item.externalUrl);
      } else {
        Alert.alert(`Tidak bisa membuka URL: ${item.externalUrl}`);
      }
    } catch (error) {
      Alert.alert('Gagal membuka link iklan.');
      console.error('Failed to open ad link:', error);
    }
  };

  // Placeholder jika image URL tidak ada (seharusnya selalu ada untuk Ad)
  const imageUrl =
    item.imageUrl ??
    'https://via.placeholder.com/400x100/cccccc/969696?text=Ad';

  return (
    <TouchableOpacity
      style={styles.adContainer}
      onPress={handlePress}
      activeOpacity={item.externalUrl ? 0.8 : 1} // Kurangi opacity hanya jika bisa diklik
      disabled={!item.externalUrl} // Disable jika tidak ada link
    >
      <Image
        source={{uri: imageUrl}}
        style={styles.adImage}
        resizeMode="cover" // Atau 'contain' tergantung desain iklan
      />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  adContainer: {
    marginBottom: 20, // Jarak antar item (termasuk job)
    borderRadius: 8,
    overflow: 'hidden', // Clip gambar
  },
  adImage: {
    width: '100%',
    aspectRatio: 4 / 1, // Rasio aspek umum untuk banner iklan (sesuaikan)
    backgroundColor: '#e0e0e0', // Background placeholder
  },
});

export default AdItemCard;
