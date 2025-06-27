import { VideoFile, VideoMetadata } from '../types/video';

// In-memory storage for demo purposes
interface VideoStorage {
  [key: string]: {
    metadata: VideoFile;
    fileData: string; // base64 encoded file data
  };
}

// In-memory storage
let videoStore: VideoStorage = {};
const STORAGE_KEY = 'videoStorage';

// Load from localStorage on module load
const loadFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      videoStore = JSON.parse(savedData);
    }
  } catch (e) {
    console.error('Failed to load video data from localStorage', e);
  }
};

// Initialize storage
loadFromStorage();

const saveToStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videoStore));
  } catch (e) {
    console.error('Failed to save video data to localStorage', e);
  }
};

export const readVideos = async (): Promise<VideoFile[]> => {
  return Object.values(videoStore).map(item => item.metadata);
};

export const getVideoData = (videoId: string): string | null => {
  return videoStore[videoId]?.fileData || null;
};

export const addVideo = async (file: File, metadata: Omit<VideoMetadata, 'id' | 'url' | 'uploadDate'>): Promise<VideoFile | null> => {
  try {
    // Convert file to base64
    const fileData = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const videoId = `video-${Date.now()}-${file.name}`;
    const newVideo: VideoFile = {
      id: videoId,
      name: metadata.name,
      size: metadata.size,
      mimeType: metadata.mimeType,
      uploadDate: new Date().toISOString(),
      url: URL.createObjectURL(file) // Create object URL for direct access
    };

    // Store both metadata and file data
    videoStore[videoId] = {
      metadata: { ...newVideo },
      fileData
    };

    saveToStorage();
    return newVideo;
  } catch (error) {
    console.error('Error adding video:', error);
    return null;
  }
};

export const removeVideo = async (videoId: string): Promise<boolean> => {
  try {
    if (videoStore[videoId]) {
      // Revoke object URL to free memory
      if (videoStore[videoId].metadata.url.startsWith('blob:')) {
        URL.revokeObjectURL(videoStore[videoId].metadata.url);
      }
      delete videoStore[videoId];
      saveToStorage();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing video:', error);
    return false;
  }
};