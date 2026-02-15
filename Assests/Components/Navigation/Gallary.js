import React from 'react';
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { useGallery, useIsAppActive } from '../hooks';
import { useIsFocused } from '@react-navigation/native';

export default function Gallery() {
  const { photos, refreshing, refresh } = useGallery('Jovision Album');
  const isFocused = useIsFocused();
  const isAppActive = useIsAppActive();
  if (!isFocused || !isAppActive) return <Text>Not Active</Text>;
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
  img: {
    width: ' 49%',
    aspectRatio: 1,
    margin: '0.6%',
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: 'contain',
    borderWidth: 2,
    borderColor: 'rgb(69, 143, 233)',
  },
  empty: { marginTop: 20, textAlign: 'center' },
});
