import './App.css';
import React from "react";
import Home from "./pages/home";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setContext } from '@apollo/client/link/context';
import AppNavbar from "./components/Navbar";
import { Outlet } from 'react-router-dom';
import { SearchProvider } from './context/SearchContext'; 



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
    <>
    <ApolloProvider client={client}>
      <SearchProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
          <AppNavbar />
          <Outlet />
      </GoogleOAuthProvider>
      </SearchProvider>
    </ApolloProvider>
    </>
  );
}


export default App;
