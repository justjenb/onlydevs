import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

import Auth from "../utils/auth";

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false); // New state

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            OnlyDevs
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/feeds">
Feeds              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/saved">
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>
                  Login/Sign Up
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="login-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="login-modal">
            {showSignup ? "Sign Up" : "Login"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showSignup ? (
            <SignupForm handleModalClose={() => setShowModal(false)} />
          ) : (
            <LoginForm handleModalClose={() => setShowModal(false)} />
          )}
        </Modal.Body>
        <Modal.Footer>
          {showSignup ? (
            <Button variant="secondary" onClick={() => setShowSignup(false)}>
              Already have an account?
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => setShowSignup(true)}>
              Don't have an account? Sign Up
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppNavbar;
