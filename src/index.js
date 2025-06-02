import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider }from './context/SessionContext';
import { loadAppConfig } from './config'; // 설정 로더 임포트



const root = ReactDOM.createRoot(document.getElementById('root'));
loadAppConfig().then(() => {
  root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  );
});

