import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileIcon, CheckCircle, Loader } from 'lucide-react';
import { Box, Text, Progress, VStack, HStack, Badge } from '@chakra-ui/react';

interface UploadStatus {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  onUploadProgress,
  accept = {},
  maxSize = 500 * 1024 * 1024, // 500MB default
  multiple = true,
}) => {
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadStatus>>({});
  const workersRef = useRef<Record<string, Worker>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const fileId = Math.random().toString(36).slice(2, 9);
      
      setUploadStatus(prev => ({
        ...prev,
        [fileId]: {
          file,
          progress: 0,
          status: 'uploading' as const
        }
      }));

      const worker = new Worker(new URL('../../workers/upload.worker.ts', import.meta.url), {
        type: 'module'
      });
      
      workersRef.current[fileId] = worker;

      worker.onmessage = (event) => {
        const { type, progress, fileId: workerFileId, error } = event.data;
        
        if (type === 'progress') {
          setUploadStatus(prev => ({
            ...prev,
            [workerFileId]: {
              ...prev[workerFileId],
              progress,
              status: 'uploading' as const
            }
          }));
          
          onUploadProgress?.(workerFileId, progress);
        } else if (type === 'complete') {
          setUploadStatus(prev => ({
            ...prev,
            [workerFileId]: {
              ...prev[workerFileId],
              progress: 100,
              status: 'completed' as const
            }
          }));
          
          worker.terminate();
          delete workersRef.current[workerFileId];

          onUpload([file]);
          onUploadProgress?.(workerFileId, 100);

        } else if (type === 'error') {
          setUploadStatus(prev => ({
            ...prev,
            [workerFileId]: {
              ...prev[workerFileId],
              status: 'error' as const,
              error: error || 'Upload failed'
            }
          }));
          
          worker.terminate();
          delete workersRef.current[workerFileId];
        }
      };

      worker.postMessage({ 
        file, 
        type: 'upload',
        chunkSize: 5 * 1024 * 1024,
        fileId
      });
    });
  }, [onUpload, onUploadProgress]);

  useEffect(() => {
    return () => {
      // I'm cleaning up all workers when component unmounts
      Object.values(workersRef.current).forEach(worker => worker.terminate());
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        borderRadius="md"
        p={8}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: 'blue.400' }}
        transition="border-color 0.2s"
        mb={4}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 text-gray-400" size={24} />
        <Text>
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select files'}
        </Text>
      </Box>

      <VStack spacing={3} align="stretch">
        {Object.entries(uploadStatus).map(([fileId, { file, progress, status, error }]) => (
          <Box 
            key={fileId} 
            p={3} 
            borderWidth={1} 
            borderRadius="md"
            borderColor={status === 'error' ? 'red.200' : 'gray.200'}
            bg={status === 'error' ? 'red.50' : 'white'}
          >
            <HStack justify="space-between" mb={2}>
              <HStack>
                <FileIcon size={16} className="text-gray-500" />
                <Text fontSize="sm" isTruncated maxW="200px">
                  {file.name}
                </Text>
              </HStack>
              <HStack>
                {status === 'uploading' && (
                  <Loader size={16} className="animate-spin text-blue-500" />
                )}
                {status === 'completed' && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
                {status === 'error' && (
                  <Badge colorScheme="red">Error</Badge>
                )}
                <Text fontSize="sm" fontWeight="medium">
                  {progress}%
                </Text>
              </HStack>
            </HStack>
            
            <Progress 
              value={progress} 
              size="xs" 
              colorScheme={
                status === 'completed' ? 'green' : 
                status === 'error' ? 'red' : 'blue'
              } 
              mb={1} 
            />
            
            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.500">
                {formatFileSize((progress / 100) * file.size)} / {formatFileSize(file.size)}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {status === 'uploading' ? 'Uploading...' : 
                 status === 'completed' ? 'Completed' : 'Failed'}
              </Text>
            </HStack>
            
            {error && (
              <Text fontSize="xs" color="red.500" mt={1}>
                {error}
              </Text>
            )}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default FileUpload;