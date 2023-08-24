import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';  // Import this
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

const root = createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>              {/* Wrap your app with ApolloProvider */}
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </ApolloProvider>
);
