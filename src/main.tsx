import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
import './index.css';
import EnvironmentInfo from './components/Demo/EnvironmentInfo';
// import { Application } from './components/application/Application';
// import { SimplePost } from './components/1Simple/SimplePost';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      {/* <EnvironmentInfo /> */}
      {/* <Application/> */}
      {/* <SimplePost user="Alex" content="Some content"/> */}
    </Provider>
  </StrictMode>
);