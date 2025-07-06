import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PropsWithChildren, ReactElement } from 'react';


type RootState = Record<string, unknown>;

// we can import our actual reducers here
const rootReducer = {
  // Add reducers here
};

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: any; 
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: rootReducer,
      preloadedState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) => {
  const Wrapper = ({ children }: PropsWithChildren<{}>): ReactElement => (
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ChakraProvider>
    </Provider>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from '@testing-library/react';
export { renderWithProviders as render };
