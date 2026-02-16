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
import Video from 'react-native-video';

export default function Gallery() {
  const { photos: media, refreshing, refresh } = useGallery();
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
        data={media}
        keyExtractor={(uri, idx) => `${uri}-${idx}`}
        numColumns={2}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        renderItem={({ item }) => {
          const ext = item.split('.').pop()?.toLowerCase();
          const isVideo = ['mp4', 'mov', 'm4v'].includes(ext);

          return (
            <View style={styles.itemWrapper}>
              <Image source={{ uri: item }} style={styles.item} />

              {isVideo && (
                <View style={styles.videoTag}>
                  <Text style={styles.videoText}>VIDEO</Text>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No media yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 10 },

  item: {
    width: '95%',
    aspectRatio: 1,
    margin: 4,
    borderRadius: 8,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: 'rgb(69, 143, 233)',
  },

  empty: { marginTop: 20, textAlign: 'center' },
  itemWrapper: {
    position: 'relative',
    width: '48%',
    aspectRatio: 1,
    margin: 4,
  },

  videoTag: {
    position: 'absolute',
    bottom: 7,
    left: 7,
    backgroundColor: 'rgba(40, 69, 215, 0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  videoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
