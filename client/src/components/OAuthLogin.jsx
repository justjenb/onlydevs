import React, { useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { IconGithub, IconGoogle } from "../assets/icons";
import { useNavigate } from "react-router-dom";

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

const OAuthLogin = () => {
  const navigate = useNavigate();

  const loginToGithub = () => {
    localStorage.setItem("loginWith", "GitHub");
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}`
    );
  };

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      const googleAccounts = window.google.accounts.id;
      googleAccounts.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });
      googleAccounts.renderButton(
        document.getElementById("googleButtonDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = (credentialResponse) => {
    console.log(credentialResponse);
    localStorage.setItem("loginWith", "Google");
    navigate("/");
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "420px", padding: "20px" }}
      >
        <Button
          variant="outline-primary"
          onClick={loginToGithub}
        >
          <IconGithub className="mr-2" /> GitHub
        </Button>
        <div id="googleButtonDiv"></div>
      </Card>
    </Container>
  );
};

export default OAuthLogin;
