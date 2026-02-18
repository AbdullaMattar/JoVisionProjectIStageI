import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  Modal,
  Button,
  TextInput,
} from 'react-native';
import { useGallery, useIsAppActive, renameFile, deleteFile } from '../hooks';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Video from 'react-native-video';

export default function Gallery() {
  const { photos: media, refreshing, refresh } = useGallery();
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState({
    uri: '',
    type: null,
    index: null,
  });
  const isAppActive = useIsAppActive();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [renameVisible, setRenameVisible] = useState(false);
  useEffect(() => {
    if (isFocused && isAppActive) {
      refresh();
      setModalVisible(false);
    }
  }, [isFocused, isAppActive]);

  if (!isFocused || !isAppActive) return <Text>Not Active</Text>;
  function toggleRename() {
    setRenameVisible(p => !p);
  }

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
        renderItem={({ item, index }) => {
          const ext = item.split('.').pop()?.toLowerCase();
          const isVideo = ['mp4', 'mov', 'm4v'].includes(ext);

          return (
            <View style={styles.itemWrapper}>
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                  setSelected({ uri: item, type: isVideo, index: index });
                  setRenameVisible(false);
                }}>
                <Image source={{ uri: item }} style={styles.item} />
              </Pressable>

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
      {/* options modal */}
      <Modal
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalBG}
          onPress={() => setModalVisible(false)}>
          <Pressable style={styles.optionsPortal}>
            <Text style={{ color: 'black', fontSize: 22 }}>Options</Text>
            <View style={styles.optionsBtns}>
              <Button title="Rename" onPress={toggleRename} />
              {renameVisible && <Rename />}
              <Button
                title="Fullscreen"
                onPress={() =>
                  navigation.navigate('MediaViewer', {
                    uri: selected?.uri,
                    type: selected?.type,
                    index: selected?.index,
                  })
                }
              />
              <Button title="Delete" onPress={Delete} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );

  function Rename() {
    const [fileName, setfileName] = useState();

    async function changebtn() {
      if (fileName === undefined) return;
      try {
        await renameFile(selected.uri, String(fileName).trim());
      } catch (e) {
        console.log(e);
      } finally {
        refresh();
        setModalVisible(false);
      }
    }
    return (
      <View style={{ gap: 10, borderWidth: 6, borderRadius: 10, padding: 25 }}>
        <Text>File Name : {selected.uri}</Text>
        <TextInput
          placeholder="Enter the new file name"
          placeholderTextColor={'black'}
          style={styles.textInput}
          onChangeText={t => setfileName(t)}
        />
        <Button title="Change" color={'rgb(215, 147, 0)'} onPress={changebtn} />
      </View>
    );
  }

  async function Delete() {
    await deleteFile(selected.uri);
    refresh();
    setModalVisible(false);
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
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
  optionsPortal: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBG: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsBtns: {
    width: '100%',
    padding: 20,
    marginTop: 10,
    gap: 25,
    borderTopWidth: 5,
    borderRadius: 10,
    borderTopColor: 'rgba(207, 22, 22, 0.5)',
  },

  textInput: {
    color: 'black',
    padding: 10,
    borderWidth: 5,
    borderRadius: 10,
    borderTopColor: 'rgba(13, 113, 141, 0.5)',
  },
});
