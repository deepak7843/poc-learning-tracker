import React, { useEffect, useState } from 'react';
import { Box, Text, Progress } from '@chakra-ui/react';
import { Video } from 'lucide-react';

interface StreamingVideoProps {
  videoId: string;
}

const StreamingVideo: React.FC<StreamingVideoProps> = ({ videoId }) => {
  const [streamedContent, setStreamedContent] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const worker = new Worker(
      new URL('../../workers/stream.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (event) => {
      if (event.data.chunk) {
        setStreamedContent(prev => [...prev, event.data.chunk]);
        setProgress(event.data.progress);
      }

      if (event.data.done) {
        setIsLoading(false);
        worker.terminate();
      }
    };

    worker.postMessage({ 
      type: 'stream', 
      videoId,
      chunkSize: 1024 // 1KB chunks
    });

    return () => worker.terminate();
  }, [videoId]);

  return (
    <Box className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Video className="w-5 h-5 text-primary-500" />
        <Text className="font-medium">Video Stream</Text>
      </div>

      {isLoading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-600">Buffering video stream...</span>
            <span className="text-primary-600 font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            size="sm"
            colorScheme="blue"
            className="rounded-full"
          />
        </div>
      )}

      <Box
        className="bg-neutral-50 rounded-lg p-4 font-mono text-sm"
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      >
        <div className="space-y-2">
          {streamedContent.map((chunk, index) => (
            <div 
              key={index}
              className="p-2 bg-white rounded border border-neutral-200 animate-fade-in"
            >
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>Chunk {index + 1}</span>
                <span>{chunk.length} bytes</span>
              </div>
              <pre className="whitespace-pre-wrap break-all">
                {chunk}
              </pre>
            </div>
          ))}
          {!streamedContent.length && (
            <div className="text-center text-neutral-500 py-4">
              Waiting for stream data...
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default StreamingVideo;