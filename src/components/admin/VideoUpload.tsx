import React, { useState, useEffect, useCallback } from 'react';
import { Box, Heading, Text, Button, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { Download, Trash2 } from 'lucide-react';
import { VideoFile } from '../../types/video';
import { readVideos, addVideo, removeVideo, getVideoData } from '../../utils/videoUtils';
import FileUpload from '../common/FileUpload';

const VideoUpload: React.FC = () => {
  const [uploadedVideos, setUploadedVideos] = useState<VideoFile[]>([]);
  const toast = useToast();

  useEffect(() => {
    const loadVideos = async () => {
      const videos = await readVideos();
      setUploadedVideos(videos);
    };
    loadVideos();
  }, []);

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        // Create video metadata with only the required fields
        const videoMetadata = {
          name: file.name,
          size: file.size,
          mimeType: file.type,
        };

        // Add video to storage
        const newVideo = await addVideo(file, videoMetadata);
        
        if (newVideo) {
          setUploadedVideos(prev => [...prev, newVideo]);
          toast({
            title: 'Video uploaded successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: 'There was an error uploading the video.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await removeVideo(videoId);
      setUploadedVideos(prev => prev.filter(video => video.id !== videoId));
      toast({
        title: 'Video deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        title: 'Error deleting video',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownload = useCallback(async (video: VideoFile) => {
    try {
      // Get the video data from storage
      const videoData = getVideoData(video.id);
      if (!videoData) {
        throw new Error('Video data not found');
      }
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = videoData;
      link.download = video.name || `video-${video.id}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Download started',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        title: 'Error downloading video',
        description: error instanceof Error ? error.message : 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  return (
    <Box className="p-6">
      <Heading size="lg" className="mb-2">Upload Videos</Heading>
      <Text className="text-neutral-600 mb-6">
        Upload and manage training videos for employees
      </Text>

      <FileUpload
        onUpload={handleUpload}
        accept={{
          'video/*': ['.mp4', '.webm', '.ogg']
        }}
        maxSize={500 * 1024 * 1024} // 500MB
      />

      {uploadedVideos.length > 0 && (
        <>
          <Box className="mt-8">
            <Heading size="md" className="mb-4">Uploaded Videos</Heading>
            <Box className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Size</Th>
                    <Th>Upload Date</Th>
                    <Th>Type</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {uploadedVideos.map((video) => (
                    <Tr key={video.id}>
                      <Td>{video.name}</Td>
                      <Td>{(video.size / (1024 * 1024)).toFixed(2)} MB</Td>
                      <Td>{video.uploadDate}</Td>
                      <Td>{video.mimeType}</Td>
                      <Td>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            colorScheme="blue"
                            variant="ghost"
                            onClick={() => handleDownload(video)}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => handleDelete(video.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>

        </>
      )}
    </Box>
  );
};

export default VideoUpload;