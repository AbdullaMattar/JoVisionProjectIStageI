import RNFS from 'react-native-fs';

const DIR = `${RNFS.DocumentDirectoryPath}/JovisionMedia`;

function cleanPath(p) {
  if (!p) throw new Error('Missing path');
  return p.startsWith('file://') ? p.slice(7) : p;
}

async function ensureDir() {
  if (!(await RNFS.exists(DIR))) await RNFS.mkdir(DIR);
  return DIR;
}

export async function saveMedia({ uri, fileName, type }) {
  if (!uri || !fileName) throw new Error('uri + fileName required');

  const dir = await ensureDir();
  const dst =
    type === 'photo' ? `${dir}/${fileName}.png` : `${dir}/${fileName}.mp4`;

  await RNFS.copyFile(cleanPath(uri), dst);
  return `file://${dst}`;
}

export async function getMediaFiles() {
  try {
    const dir = await ensureDir();
    const files = await RNFS.readdir(dir);

    return files.map(f => `file://${dir}/${f}`);
  } catch (e) {
    console.log('getMediaFiles error:', e);
    return [];
  }
}
