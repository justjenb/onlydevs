// import React from "react";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setContext } from '@apollo/client/link/context';
import './App.css'

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
      <div className="flex-column justify-flex-start min-100-vh">
        <Navbar />
        <div className="container">
          <Home />
        </div>
      </div>
    </GoogleOAuthProvider>
    </ApolloProvider>
  );
}

export default App;
