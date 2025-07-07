import React, { useState, useEffect, useCallback } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Heading } from '@chakra-ui/react';
import { useToast } from '../../utils/chakraToast';
import { Download, Trash2 } from 'lucide-react';
import { VideoFile } from '../../types/video';
import { readVideos, addVideo, removeVideo, getVideoData } from '../../utils/videoUtils';
import FileUpload from '../common/FileUpload';

const VideoUpload: React.FC = (): JSX.Element => {
  const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
  const toast = useToast();

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videos = await readVideos();
        setUploadedVideos(videos);
      } catch (error) {
        console.error('Error loading videos:', error);
        toast.error('Failed to load videos');
      }
    };
    loadVideos();
  }, [toast]);

  const handleUpload = useCallback(async (files: File[]) => {
    for (const file of files) {
      try {
        const videoMetadata = {
          name: file.name,
          size: file.size,
          mimeType: file.type,
        };

        await addVideo(file, videoMetadata);
        
        const updatedVideos = await readVideos();
        setUploadedVideos(updatedVideos);

        toast.success(`Video uploaded successfully: ${file.name}`);

      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'An unexpected error occurred.'}`);
      }
    }
  }, [toast]);

  const handleDelete = useCallback(async (videoId: string) => {
    try {
      await removeVideo(videoId);
      setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
      toast.success('Video deleted');
    } catch (error) {
      toast.error('Failed to delete video');
    }
  }, [toast]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = useCallback(async (video: VideoFile) => {
    try {
      const videoData = await getVideoData(video.id);
      if (!videoData) {
        toast.error('Download failed', {
          description: 'Video data could not be retrieved.',
          duration: 2000
        });
        return;
      }
      
      const blob = new Blob([videoData], { type: video.mimeType });
      const videoUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = video.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(videoUrl);

    } catch (error) {
      toast.error('Error downloading video', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        duration: 2000
      });
    }
  }, [toast]);

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>Video Upload</Heading>
      <FileUpload onUpload={handleUpload} />
      
      <Heading as="h3" size="md" my={4}>Uploaded Videos</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Size</Th>
            <Th>Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {uploadedVideos.map((video) => (
            <Tr key={video.id}>
              <Td>{video.name}</Td>
              <Td>{formatFileSize(video.size)}</Td>
              <Td>{video.mimeType}</Td>
              <Td>
                <Button 
                  size="sm" 
                  leftIcon={<Download size={16} />}
                  onClick={() => handleDownload(video)}
                  mr={2}
                >
                  Download
                </Button>
                <Button 
                  size="sm" 
                  colorScheme="red" 
                  leftIcon={<Trash2 size={16} />}
                  onClick={() => handleDelete(video.id)}
                >
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default VideoUpload;