import  { useEffect, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import ToastContainer from './components/common/ToastContainer';
import MainLayout from './components/layout/MainLayout';
import AppRoutes from './components/routing/AppRoutes';

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

function App() {
  useEffect(() => {
    document.title = 'Learning Tracker';
  }, []);
  
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <MainLayout>
          <Suspense fallback={<LoadingFallback />}>
            <AppRoutes />
          </Suspense>
        </MainLayout>
        <ToastContainer />
      </Router>
    </ChakraProvider>
  );
}

export default App;