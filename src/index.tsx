import '@generalizers/prototype-expansion';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './scss/defaults.scss';
import './scss/dev.scss';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
