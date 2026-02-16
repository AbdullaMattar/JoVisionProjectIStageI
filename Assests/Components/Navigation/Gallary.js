import React, { useEffect } from 'react';
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
  const { photos, refreshing, refresh } = useGallery(); // no album name
  const isFocused = useIsFocused();
  const isAppActive = useIsAppActive();
  useEffect(() => {
    if (isFocused && isAppActive) refresh();
  }, [isFocused, isAppActive]);

  if (!isFocused || !isAppActive) return <Text>Not Active</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>

      <FlatList
        data={photos}
        keyExtractor={(uri, idx) => `${uri}-${idx}`}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.img} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No photos yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },

  // FIXED: width was " 49%" (has space) + margin string "0.6%" (wrong type)
  img: {
    width: '49%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'rgb(69, 143, 233)',
  },

  empty: { marginTop: 20, textAlign: 'center' },
});
