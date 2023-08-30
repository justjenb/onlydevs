import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom/dist";
import 'bootstrap/dist/css/bootstrap.min.css'

import App from "./App.jsx";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Error from "./pages/error";
import CallbackHandler from './components/CallbackHandler.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    error: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/me",
        element: <Profile />,
      },
      {
        path: "/profiles/:profileId",
        element: <Profile />,
      },
      {
        path: "/api/google/auth/callback",
        element: <CallbackHandler />,
      },  
      {
        path: "/api/github/auth/callback",
        element: <CallbackHandler />,
      },      
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
