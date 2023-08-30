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
import Auth from "./utils/auth";
import useStore from "./store/index";
import { SearchProvider } from "./context/SearchContext";
import { Grid } from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";

const httpLink = createHttpLink({
  uri: "/graphql",
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
      // console.log(`Auth user: ${JSON.stringify(userProfile, null, 2)}`);
    } else {
      setAuthUser(null);
    }
  }, []);

  return (
    <>
      {" "}
      <ErrorBoundary>
        <SearchProvider>
          <ApolloProvider client={client}>
            <Grid container>
              <Grid xs={3} id="sidebar-wrapper">
                <AppNavbar />
              </Grid>
              <Grid xs={9} id="page-content-wrapper">
                <Outlet />
              </Grid>
            </Grid>
          </ApolloProvider>
        </SearchProvider>
      </ErrorBoundary>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
