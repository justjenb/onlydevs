import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from '../utils/auth';

function CallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    console.log("queryParams data:", JSON.stringify(queryParams, null, 2));
    console.log("queryParams data:", queryParams);


    const token = queryParams.get('token') || queryParams.get('githubAccessToken')

    console.log("token data:", JSON.stringify(token, null, 2));
    console.log("token data:", token);

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
