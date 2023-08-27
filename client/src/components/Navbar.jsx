import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Button, Form, FormControl, ListGroup } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Auth from "../utils/auth";
import { useQuery } from '@apollo/client';
import { GET_ALL_TAGS } from '../utils/queries';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  const { loading, data } = useQuery(GET_ALL_TAGS);
console.log("Loading:", loading);
console.log("Data:", data);
  let allPossibleSuggestions = data?.getAllTags || [];

  if (data && data.getAllTags) {
    allPossibleSuggestions = data.getAllTags.map(tag => tag.name);
  }
  useEffect(() => {
    setFocusedSuggestionIndex(-1);
  }, [suggestions]);

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const newSuggestions = allPossibleSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(newSuggestions);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const nextIndex = (focusedSuggestionIndex + 1) % suggestions.length;
      setFocusedSuggestionIndex(nextIndex);
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      const nextIndex = (focusedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
      setFocusedSuggestionIndex(nextIndex);
    } else if (e.key === "Enter" && focusedSuggestionIndex !== -1) {
      handleSuggestionClick(suggestions[focusedSuggestionIndex]);
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            OnlyDevs
          </Navbar.Brand>

          <Form inline className="mr-auto" onKeyDown={handleKeyDown}>
            <div className="position-relative">
              <FormControl
                type="text"
                placeholder="Search"
                className="mr-sm-2"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-success">Search</Button>
              {suggestions.length > 0 && (
                <ListGroup className="position-absolute w-100 suggestion-list">
                  {suggestions.map((suggestion, index) => (
                    <ListGroup.Item 
                      key={index} 
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={index === focusedSuggestionIndex ? 'active' : ''}
                      tabIndex={0}
                    >
                      {suggestion}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
          </Form>

          <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
          <Form inline className="mr-auto" onKeyDown={handleKeyDown}>
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <Button variant="outline-success">Search</Button>
            {suggestions.length > 0 && (
              <ListGroup>
                {suggestions.map((suggestion, index) => (
                  <ListGroup.Item
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={index === focusedSuggestionIndex ? "focused" : ""}
                  >
                    {suggestion}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </Form>
            <Nav className="ml-auto">
              <Nav.Link as={Link} to="/feeds">
                Feeds
              </Nav.Link>
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
