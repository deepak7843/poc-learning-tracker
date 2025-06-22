import { toast, type ToastOptions } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';

// I have used Omit**, the 'type'** property since I am handling it separately(ToastType**)
export interface ToastOptionsExtended extends Omit<ToastOptions, 'type'> {
  position?: ToastPosition;
  duration?: number;
}

const showToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptionsExtended = {}
) => {
  const { duration = 3000, position = 'top-right', ...restOptions } = options;

  const toastOptions: ToastOptions = {
    position,
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    pauseOnFocusLoss: true,
    progress: undefined,
    theme: 'light' as const,
    ...restOptions,
  };

  switch (type) {
    case 'success':
      toast.success(message, toastOptions);
      break;
    case 'error':
      toast.error(message, toastOptions);
      break;
    case 'warning':
      toast.warn(message, toastOptions);
      break;
    case 'info':
    default:
      toast.info(message, toastOptions);
  }
};

export const toastService = {
  success: (message: string, duration?: number) =>
    showToast(message, 'success', { duration }),
  error: (message: string, duration?: number) =>
    showToast(message, 'error', { duration }),
  info: (message: string, duration?: number) =>
    showToast(message, 'info', { duration }),
  warning: (message: string, duration?: number) =>
    showToast(message, 'warning', { duration }),
};
