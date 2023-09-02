import React, { useEffect } from "react";
import { Button, Container, Card } from "react-bootstrap";
import { IconGithub, IconGoogle } from "../assets/icons";
import Auth from "../utils/auth";

const OAuthLogin = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      Auth.login(token);
    }
  }, []);

  const setBaseUrl = () => {
    if (process.env.NODE_ENV === "production") {
      return "https://onlydevs-504c5476d7ee.herokuapp.com";
    } else {
      return "http://localhost:3001";
    }
  };

  const loginToGithub = () => {
    localStorage.setItem("loginWith", "GitHub");
    window.location.assign(`${setBaseUrl()}/api/github/auth`);
  };

  const loginToGoogle = () => {
    localStorage.setItem("loginWith", "Google");
    window.location.assign(`${setBaseUrl()}/api/google/auth`);
  };

  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Card
        className="shadow-sm"
        style={{ maxWidth: "420px", padding: "20px" }}
      >
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
