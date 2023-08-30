import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from '../utils/auth';

function CallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  // Utility to extract token
  const getTokenFromParams = (queryParams) => {
    return queryParams.get('token') || queryParams.get('githubAccessToken');
  }

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = getTokenFromParams(queryParams);

    if (token) {
      AuthService.login(token);
      navigate('/'); 
    } else {
      navigate('/error');
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
}

export default CallbackHandler;