// import React from 'react';
// import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { createRoot } from 'react-dom/client';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './index.css';
// import App from './App';

// const httpLink = createHttpLink({
//   uri: 'http://localhost:3000/graphql',
// });

// const authLink = setContext((_, { headers }) => {
//   const token = localStorage.getItem('id_token');
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     }
//   };
// });

// const client = new ApolloClient({
//   link: authLink.concat(httpLink),
//   cache: new InMemoryCache(),
// });

// const root = createRoot(document.getElementById('root'));
// root.render(
//   <ApolloProvider client={client}> 
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>
//   </ApolloProvider>
// );

import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
