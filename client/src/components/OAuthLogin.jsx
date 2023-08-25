import React from "react";
import { Button, Container, Card } from "react-bootstrap";
import { useGoogleLogin } from "@react-oauth/google";
import { IconGithub, IconGoogle } from "../assets/icons";
import { useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;

const OAuthLogin = () => {
  const navigate = useNavigate();

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
      navigate("/");
    },
  });

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "420px", padding: "20px" }}
      >
        <Button
          variant="outline-primary"
          auto
          ghost
          onClick={() => loginToGithub()}
        >
          <IconGithub className="mr-2" /> GitHub
        </Button>
        <Button
          variant="outline-primary"
          auto
          ghost
          onClick={() => loginToGoogle()}
        >
          <IconGoogle className="mr-2" /> Google
        </Button>
      </Card>
    </Container>
  );
};

export default OAuthLogin;
