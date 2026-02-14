import React from 'react';
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { useGallery } from '../hooks';

export default function Gallery() {
  const { photos, refreshing, refresh } = useGallery('Jovision Album');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>

      <FlatList
        data={photos}
        keyExtractor={uri => uri}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.img} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No photos yet </Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: 'center' },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  img: { width: ' 49%', aspectRatio: 1, margin: '0.66%', borderRadius: 8 },
  empty: { marginTop: 20, textAlign: 'center' },
});
