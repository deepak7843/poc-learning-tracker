self.onmessage = async (e) => {
  const { url, fileName, videoId } = e.data;
  
  try {
    // In a real app, I will fetch the file in chunks
    // This is a simplified version for demonstration
    const response = await fetch(url);
    const contentLength = response.headers.get('content-length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Simulate chunked download for demo purposes
    const chunkSize = 1024 * 1024; // 1MB chunks
    let receivedSize = 0;
    
    const reader = response.body.getReader();
    const chunks = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      chunks.push(value);
      receivedSize += value.length;
      
      const progress = totalSize > 0 
        ? Math.round((receivedSize / totalSize) * 100)
        : 0;
      
      const progressData = { 
        type: 'progress',
        progress,
        receivedSize,
        totalSize,
        videoId
      };
      self.postMessage(progressData);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Combine all chunks
    const blob = new Blob(chunks);
    const objectUrl = URL.createObjectURL(blob);
    
    // Send completion message with download URL
    const completeData = {
      type: 'complete',
      objectUrl,
      fileName,
      videoId
    };
    self.postMessage(completeData);
    
  } catch (error) {
    const errorData = {
      type: 'error',
      error: error.message,
      videoId
    };
    self.postMessage(errorData);
  }
};
