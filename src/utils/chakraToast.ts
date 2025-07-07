import { useToast as useChakraToast, UseToastOptions } from '@chakra-ui/react';

const defaultOptions: UseToastOptions = {
  duration: 3000,
  isClosable: true,
  position: 'top',
};


export const useToast = () => {
  const chakraToast = useChakraToast();
  
  const toast = (options: UseToastOptions): void => {
    chakraToast(options);
  };
  
  toast.success = (title: string, options?: UseToastOptions): void => {
    chakraToast({
      title,
      status: 'success',
      ...defaultOptions,
      ...options
    });
  };
  
  toast.error = (title: string, options?: UseToastOptions): void => {
    chakraToast({
      title,
      status: 'error',
      ...defaultOptions,
      ...options
    });
  };
  
  toast.warning = (title: string, options?: UseToastOptions): void => {
    chakraToast({
      title,
      status: 'warning',
      ...defaultOptions,
      ...options
    });
  };
  
  toast.info = (title: string, options?: UseToastOptions): void => {
    chakraToast({
      title,
      status: 'info',
      ...defaultOptions,
      ...options
    });
  };
  
  toast.close = (id: string): void => {
    chakraToast.close(id);
  };
  
  return toast;
};

