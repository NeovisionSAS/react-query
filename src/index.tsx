import App from './components/App';
import './scss/default.scss';
import '@generalizers/prototype-expansion';
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
