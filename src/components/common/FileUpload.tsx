import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon, CheckCircle } from 'lucide-react';
import { Box, Text, Progress, IconButton } from '@chakra-ui/react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept,
  maxSize = 100 * 1024 * 1024, // 100MB default
  multiple = true,
}) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles((prev) => [...prev, ...acceptedFiles]);
    
    // Initialize Web Worker for each file
    acceptedFiles.forEach(file => {
      const worker = new Worker(new URL('../../workers/upload.worker.ts', import.meta.url), {
        type: 'module'
      });

      worker.onmessage = (event) => {
        const { fileName, progress } = event.data;
        setUploadProgress(prev => ({
          ...prev,
          [fileName]: progress
        }));

        if (progress === 100) {
          worker.terminate();
        }
      };

      worker.postMessage({ file, type: 'upload' });
    });

    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  const removeFile = (fileToRemove: File) => {
    setUploadedFiles(files => files.filter(f => f !== fileToRemove));
    setUploadProgress(prev => {
      const updated = { ...prev };
      delete updated[fileToRemove.name];
      return updated;
    });
  };

  return (
    <Box className="w-full">
      <Box
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-400'}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
        <Text className="text-lg font-medium mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Text>
        <Text className="text-sm text-neutral-600">
          or click to select files
        </Text>
      </Box>

    </Box>
  );
};

export default FileUpload;