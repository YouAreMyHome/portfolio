// src/main.jsx (hoặc file entry point tương tự của bạn)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Hoặc file CSS chính của bạn
import { LanguageProvider } from './contexts/LanguageContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);