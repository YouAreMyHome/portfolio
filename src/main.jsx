// src/main.jsx (hoặc file entry point tương tự của bạn)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Hoặc file CSS chính của bạn
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Bọc App trong BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);