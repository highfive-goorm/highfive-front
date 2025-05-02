import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/style.css'; // Tailwind 지시문이 포함된 파일 경로


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

