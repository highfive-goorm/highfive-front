import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SessionProvider }from './context/SessionContext';
import { setLandingUrl } from './utils/trackingUtils'; // 랜딩 URL 설정 함수



const root = ReactDOM.createRoot(document.getElementById('root'));

setLandingUrl(); // 앱 설정 로드 후 랜딩 URL 설정
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
