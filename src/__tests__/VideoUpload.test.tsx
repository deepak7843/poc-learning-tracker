import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChakraProvider } from '@chakra-ui/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import VideoUpload from '../components/admin/VideoUpload';
import { readVideos, addVideo, removeVideo, getVideoData } from '../utils/videoUtils';
import { VideoFile } from '../types/video';


vi.mock('../utils/videoUtils');


let onUploadCallback: (files: { file: File; status: 'completed' | 'error'; error?: string }[]) => void;
vi.mock('../components/common/FileUpload', () => ({
  default: ({ onUpload }: { onUpload: (files: any) => void }) => {
    onUploadCallback = onUpload;
    return <div data-testid="mock-file-upload"></div>;
  },
}));


const mockToast = vi.fn();
vi.mock('@chakra-ui/react', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@chakra-ui/react')>();
    return {
        ...actual,
        useToast: () => mockToast,
    };
});


describe('VideoUpload Component', () => {
  const mockVideos: VideoFile[] = [
    { id: '1', name: 'test.mp4', size: 1024, uploadDate: '2023-01-01T12:00:00Z', mimeType: 'video/mp4', url: 'blob:mock-url' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readVideos).mockResolvedValue([...mockVideos]);
    vi.mocked(addVideo).mockImplementation(async (file, metadata) => ({
      ...metadata,
      id: 'new-id',
      uploadDate: new Date().toISOString(),
      url: `blob:mock-url-${Math.random()}`,
      size: file.size,
    }));
    vi.mocked(removeVideo).mockResolvedValue(undefined);
    vi.mocked(getVideoData).mockResolvedValue(new ArrayBuffer(8));
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  const renderComponent = () => {
    render(
      <ChakraProvider>
        <VideoUpload />
      </ChakraProvider>
    );
  };

  it('should render and load initial videos', async () => {
    renderComponent();
    expect(screen.getByText('Upload Videos')).toBeInTheDocument();
    await waitFor(() => {
      expect(readVideos).toHaveBeenCalledTimes(1);
      expect(screen.getByText('test.mp4')).toBeInTheDocument();
    });
  });

  it('should handle successful video upload', async () => {
    renderComponent();
    await waitFor(() => expect(readVideos).toHaveBeenCalled());

    const newFile = new File(['content'], 'new-video.mp4', { type: 'video/mp4' });
    

    act(() => {
        onUploadCallback([{ file: newFile, status: 'completed' }]);
    });

    await waitFor(() => {
      expect(addVideo).toHaveBeenCalledWith(newFile, expect.objectContaining({ name: 'new-video.mp4' }));
      expect(screen.getByText('new-video.mp4')).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ status: 'success', title: 'Video uploaded' }));
    });
  });

  it('should handle failed video upload', async () => {
    renderComponent();
    const errorFile = new File(['content'], 'error.mp4', { type: 'video/mp4' });


    act(() => {
        onUploadCallback([{ file: errorFile, status: 'error', error: 'Upload failed' }]);
    });

    await waitFor(() => {
      expect(addVideo).not.toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ status: 'error', title: 'Upload failed for error.mp4' }));
    });
  });

  it('should handle video deletion', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('test.mp4')).toBeInTheDocument());

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(removeVideo).toHaveBeenCalledWith('1');
      expect(screen.queryByText('test.mp4')).not.toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ status: 'info', title: 'Video deleted' }));
    });
  });

  it('should handle video download', async () => {
    renderComponent();
    await waitFor(() => expect(screen.getByText('test.mp4')).toBeInTheDocument());

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(getVideoData).toHaveBeenCalledWith('1');
      expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
  });

  it('should show an error toast if video deletion fails', async () => {
    vi.mocked(removeVideo).mockRejectedValue(new Error('Deletion failed'));
    renderComponent();
    await waitFor(() => expect(screen.getByText('test.mp4')).toBeInTheDocument());

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ status: 'error', title: 'Error deleting video' }));
    });
  });

  it('should show an error toast if video download fails', async () => {
    vi.mocked(getVideoData).mockRejectedValue(new Error('Download failed'));
    renderComponent();
    await waitFor(() => expect(screen.getByText('test.mp4')).toBeInTheDocument());

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ status: 'error', title: 'Error downloading video' }));
    });
  });
});
