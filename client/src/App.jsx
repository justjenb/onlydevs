import "./App.css";
import React from "react";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AppNavbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import Auth from './utils/auth';
import useStore from './store/index';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
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

function AppContent() {
  const { authUser, setAuthUser } = useStore();

  React.useEffect(() => {
    const token = Auth.getToken();

    if (token && Auth.loggedIn()) {
      const userProfile = Auth.getProfile();
      setAuthUser(userProfile);
      console.log(`Auth user ${userProfile}`);
    } else {
      setAuthUser(null);
    }
  }, []);

  return (
    <>
      <ApolloProvider client={client}>
        <AppNavbar />
        <Outlet />
      </ApolloProvider>
    </>
  );
}


function App() {
  return <AppContent />;
}


export default App;
