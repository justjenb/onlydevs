import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Button, Form, FormControl, ListGroup } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Auth from "../utils/auth";
import { useQuery } from '@apollo/client';
import { toast } from "react-toastify";
import useStore from "../store";
import { GET_ALL_TAGS } from '../utils/queries';
import '../App.css';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const { authUser, setAuthUser } = useStore();
  
  const navigate = useNavigate();
  const store = useStore();
  const user = store.authUser;

  const { loading, data } = useQuery(GET_ALL_TAGS);
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

  const handleLogout = () => {
    Auth.logout();
    setAuthUser(null);
    navigate('/');
};

  return (
    <>
     <Nav className="side-navbar">
     <div className="nav-item">
        <Navbar.Brand as={Link} to="/" className="nav-item">
            OnlyDevs
        </Navbar.Brand>
        </div>
        <div className="nav-item">
          <Form onKeyDown={handleKeyDown}>
              <FormControl
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              />
              <Button variant="outline-success">Search</Button>
              {suggestions.length > 0 && (
              <ListGroup className="suggestion-list">
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
            </Form>
        </div>
        <div className="nav-item">
            <Link to="/messages">
              <img/> Messages
            </Link>
          </div>
        <div className="nav-item">
        <Navbar.Toggle aria-controls="navbar" />
          <Navbar.Collapse id="navbar">
          <Nav.Link as={Link} to="/feeds">
                Feeds
              </Nav.Link>

          {user ? (
            <>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              <Nav.Link onClick={handleLogout}>
                Logout
              </Nav.Link>
     </>       
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>
                  Login/Sign Up
                </Nav.Link>
              )}
              </Navbar.Collapse>
          </div>
          </Nav>

       <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} aria-labelledby="login-modal">
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

{/*   return (
//     <>
//       <Navbar bg="dark" variant="dark" expand="lg">
//         <Container fluid>
//           <Navbar.Brand as={Link} to="/">
//             OnlyDevs
//           </Navbar.Brand>

//           <Form as="div" className="mr-auto" onKeyDown={handleKeyDown}>
//             <div className="position-relative">
//               <FormControl
//                 type="text"
//                 placeholder="Search"
//                 className="mr-sm-2"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//               />
//               <Button variant="outline-success">Search</Button>
//               {suggestions.length > 0 && (
//                 <ListGroup className="position-absolute w-100 suggestion-list">
//                   {suggestions.map((suggestion, index) => (
//                     <ListGroup.Item 
//                       key={index} 
//                       onClick={() => handleSuggestionClick(suggestion)}
//                       className={index === focusedSuggestionIndex ? 'active' : ''}
//                       tabIndex={0}
//                     >
//                       {suggestion}
//                     </ListGroup.Item>
//                   ))}
//                 </ListGroup>
//               )}
//             </div>
//           </Form>

//           <Navbar.Toggle aria-controls="navbar" />
//           <Navbar.Collapse id="navbar">
//             <Nav className="ml-auto">
//               <Nav.Link as={Link} to="/feeds">
//                 Feeds
//               </Nav.Link>

//               {user ? (
//                 <>
//                   <Nav.Link as={Link} to="/profile">
//                     Profile
//                   </Nav.Link>
//                   <Nav.Link as={Link} to="/saved">
//                     See Your Books
//                   </Nav.Link>
//                   <Nav.Link onClick={handleLogout}>
//                     Logout
//                   </Nav.Link>
//                 </>
//               ) : (
//                 <Nav.Link onClick={() => setShowModal(true)}>
//                   Login/Sign Up
//                 </Nav.Link>
//               )}
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Modal
//         size="lg"
//         show={showModal}
//         onHide={() => setShowModal(false)}
//         aria-labelledby="login-modal"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="login-modal">
//             {showSignup ? "Sign Up" : "Login"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {showSignup ? (
//             <SignupForm handleModalClose={() => setShowModal(false)} />
//           ) : (
//             <LoginForm handleModalClose={() => setShowModal(false)} />
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           {showSignup ? (
//             <Button variant="secondary" onClick={() => setShowSignup(false)}>
//               Already have an account?
//             </Button>
//           ) : (
//             <Button variant="secondary" onClick={() => setShowSignup(true)}>
//               Don't have an account? Sign Up
//             </Button>
//           )}
//         </Modal.Footer>
//       </Modal>
//     </>
//   ); */>
}; 

export default AppNavbar;