import App from './components/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './scss/default.scss';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
