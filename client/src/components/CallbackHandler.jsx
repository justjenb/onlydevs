import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from '../utils/auth';

function CallbackHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      AuthService.login(token);
      navigate('/');  // Or wherever you want
    } else {
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Processing authentication...</div>;
}

export default CallbackHandler;
