import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import { Provider } from 'react-redux';
import store from 'store/store';

const root = ReactDOM.createRoot(document.querySelector('.root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
