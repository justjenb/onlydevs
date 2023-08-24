import React from 'react';
import { Button, Container, Card } from 'react-bootstrap';
import { useGoogleLogin } from '@react-oauth/google';
import { IconGithub, IconGoogle } from "../assets/icons";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;

const OAuthLogin = () => {
  const loginToGithub = () => {
    localStorage.setItem("loginWith", "GitHub");
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
    );
  };

  const loginToGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      localStorage.setItem("loginWith", "Google");
      localStorage.setItem("accessToken", tokenResponse.access_token);
      // You will need to handle the navigation after successful login
      // navigate("/home");
    },
  });

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
      <Card style={{ maxWidth: "420px", padding: "20px" }}>
        <h1 className="text-center mb-3">Login with</h1>
        <Button variant="outline-primary" onClick={loginToGithub}>
          <IconGithub className="mr-2" /> GitHub
        </Button>
        <Button variant="outline-primary" onClick={loginToGoogle}>
          <IconGoogle className="mr-2" /> Google
        </Button>
      </Card>
    </Container>
  );
};

export default OAuthLogin;
