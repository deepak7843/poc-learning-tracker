import { VideoFile, VideoMetadata } from '../types/video';

const DB_NAME = 'VideoStorageDB';
const DB_VERSION = 1;
const STORE_VIDEOS = 'videos';
const STORE_FILES = 'videoFiles';

let dbPromise: Promise<IDBDatabase> | null = null;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(new Error(`Failed to open database: ${request.error?.message}`));
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_FILES)) {
        // We store video data separately with the same ID
        db.createObjectStore(STORE_FILES, { keyPath: 'id' });
      }
    };
  });
};

const getDB = (): Promise<IDBDatabase> => {
  if (!dbPromise) {
    dbPromise = initDB();
  }
  return dbPromise;
};

// Helper to promisify a request, which is the standard way to work with IndexedDB
const promisifyRequest = <T>(request: IDBRequest<T>): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addVideo = async (
  file: File,
  metadata: Omit<VideoMetadata, 'id' | 'url' | 'uploadDate'>
): Promise<VideoFile> => {
  const db = await getDB();
  const videoId = `video-${Date.now()}-${file.name}`;
  const newVideo: VideoFile = {
    id: videoId,
    ...metadata,
    uploadDate: new Date().toISOString(),
    url: '',
  };

  // IMPORTANT: Read the file into memory BEFORE starting the transaction.
  // This prevents the transaction from auto-committing, which was the root cause of the error.
  const fileBuffer = await file.arrayBuffer();

  const tx = db.transaction([STORE_VIDEOS, STORE_FILES], 'readwrite');
  const videosStore = tx.objectStore(STORE_VIDEOS);
  const filesStore = tx.objectStore(STORE_FILES);

  // Wait for both 'add' operations to complete within the same transaction.
  await Promise.all([
    promisifyRequest(videosStore.add(newVideo)),
    promisifyRequest(filesStore.add({ id: videoId, data: fileBuffer })),
  ]);

  return newVideo;
};

export const readVideos = async (): Promise<VideoFile[]> => {
  const db = await getDB();
  const tx = db.transaction(STORE_VIDEOS, 'readonly');
  const store = tx.objectStore(STORE_VIDEOS);
  const videos = await promisifyRequest(store.getAll());
  return videos || [];
};

export const getVideoData = async (videoId: string): Promise<ArrayBuffer | null> => {
  const db = await getDB();
  const tx = db.transaction(STORE_FILES, 'readonly');
  const store = tx.objectStore(STORE_FILES);
  const fileObject = await promisifyRequest(store.get(videoId));
  return fileObject ? (fileObject as any).data : null;
};

export const removeVideo = async (videoId: string): Promise<void> => {
  const db = await getDB();
  const tx = db.transaction([STORE_VIDEOS, STORE_FILES], 'readwrite');
  const videosStore = tx.objectStore(STORE_VIDEOS);
  const filesStore = tx.objectStore(STORE_FILES);

  await Promise.all([
    promisifyRequest(videosStore.delete(videoId)),
    promisifyRequest(filesStore.delete(videoId)),
  ]);
};