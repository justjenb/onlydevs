import { useGoogleLogin } from '@react-oauth/google';
import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';
import { IconGithub, IconGoogle } from "../assets/icons";
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID;

import Auth from '../utils/auth';

const LoginForm = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);  // Assuming you want to show error alerts.
  const [login, { error, data }] = useMutation(LOGIN_USER);

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
      navigate("/home");
    },
  });

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (event.currentTarget.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
      setFormState({ email: '', password: '' });
    } catch (e) {
      setShowAlert(true);
      console.error(e);
    }
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <Card style={{ maxWidth: "420px", padding: "20px" }}>
          <h1 className="text-center mb-3">
            Login with
          </h1>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <Button variant="outline-primary" onClick={() => loginToGithub()}>
              <IconGithub className="mr-2" />
            GitHub
          </Button>
          </div>
          <div className="mb-3 d-flex align-items-center justify-content-between">
            <Button variant="outline-primary" onClick={() => loginToGoogle()}>
              <IconGoogle className="mr-2" />
            Google
          </Button>
          </div>
        </Card>
      </Container>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleChange}   // Adjusted to use handleChange
        value={formState.email}  // Adjusted to use formState
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleChange}   // Adjusted to use handleChange
        value={formState.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        <Button
  disabled={!(formState.email && formState.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm;
