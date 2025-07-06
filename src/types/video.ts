export interface VideoFile {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  url: string; // Required URL for the video file
  mimeType: string;
  duration?: number;
  thumbnail?: string;
}

export interface VideoMetadata {
  id?: string;
  name: string;
  size: number;
  uploadDate?: string;
  url?: string;
  mimeType: string;
  duration?: number;
  thumbnail?: string;
}
