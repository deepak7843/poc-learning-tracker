// I'm setting up an event listener for messages sent to this Web Worker
self.onmessage = async (e) => {
  const { file, chunkSize = 5 * 1024 * 1024, fileId } = e.data;
  // chunkSize: Defaults to 5MB if not specified
  const totalChunks = Math.ceil(file.size / chunkSize);
  let uploadedChunks = 0;

  // Simulate chunked upload
  for (let start = 0; start < file.size; start += chunkSize) {
    try {
      // Simulate chunk upload with some processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      uploadedChunks++;
      const progress = Math.round((uploadedChunks / totalChunks) * 100);
      
      // After each chunk, sending a progress update message back to the main thread
      self.postMessage({
        type: 'progress',
        progress,
        fileId,
        chunk: uploadedChunks,
        totalChunks
      });
      
      // If upload is complete
      if (uploadedChunks === totalChunks) {
        // In a real app, I will be combining chunks on the server
        // For demo, I am just returning a success response
        // In a real app, this would be after server confirms all chunks are received
        self.postMessage({
          type: 'complete',
          fileId,
          success: true
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        self.postMessage({
          type: 'error',
          fileId,
          error: error.message
        });
      } else {
        self.postMessage({
          type: 'error',
          fileId,
          error: String(error)
        });
      }
      break;
    }
  }
};

export {};
