import React from 'react';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);

