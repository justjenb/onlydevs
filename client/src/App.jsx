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
import {
  Box,
  Drawer,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
} from "@mui/material";
import ErrorBoundary from "./components/ErrorBoundary";
import AppHeader from "./components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

const drawerWidth = "15%";

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
            <Box sx={{ display: "flex" }}>
              <CssBaseline />
              <AppBar
                position="fixed"
                sx={{
                  width: `calc(100% - ${drawerWidth}px)`,
                  ml: `${drawerWidth}px`,
                }}
              >
                <Drawer
                  sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                      width: drawerWidth,
                      boxSizing: "border-box",
                    },
                  }}
                  variant="permanent"
                  anchor="left"
                >
                  <AppNavbar></AppNavbar>
                </Drawer>
              </AppBar>
              <Divider />
              <Toolbar />
              <Box component="main" id="main" sx={{ flexGrow: 1, p: 3 }}>
                <AppHeader />
                <Outlet />
              </Box>
            </Box>
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
