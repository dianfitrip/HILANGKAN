import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- Perhatikan '.client'
import './index.css';
import App from './App';

// React 19 Wajib pakai createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);