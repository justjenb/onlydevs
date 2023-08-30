import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form, FormControl, ListGroup } from "react-bootstrap";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import Auth from "../utils/auth";
import { useQuery, useLazyQuery } from '@apollo/client';
// import { toast } from "react-toastify";
import useStore from "../store";
import { GET_ALL_TAGS, SEARCH } from '../utils/queries';
import { useSearch } from '../context/SearchContext';
import '../App.css';
import { Home, NotificationsActiveSharp, NotificationsNoneSharp, Search, ThreeP, AddCircle, AccountCircle }  from '@mui/icons-material';
import { Tooltip, Grid, Fab } from '@mui/material'
import CreatePostForm from './CreatePostForm';
import logo from '../assets/images/olives.svg';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const [isExpanded, setExpanded] = useState(false);

  const { searchResults, setSearchResults } = useSearch();

  const { authUser, setAuthUser } = useStore(state => ({ authUser: state.authUser, setAuthUser: state.setAuthUser }));
  const navigate = useNavigate();
  const store = useStore();
  const user = store.authUser;

  const [search, { data: searchData }] = useLazyQuery(SEARCH);

  useEffect(() => {
    if (searchData) {
      setSearchResults(searchData.search);
    }
  }, [searchData]);

  const { loading, data } = useQuery(GET_ALL_TAGS);
  let allPossibleSuggestions = data?.getAllTags || [];

  if (data && data.getAllTags) {
    allPossibleSuggestions = data.getAllTags.map(tag => tag.name);
  }
  
  useEffect(() => {
    setFocusedSuggestionIndex(-1);
  }, [suggestions]);

  const handleSearch = () => {
    search({
      variables: { query: searchTerm }
    });
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
     <div className="side-navbar">
      <div className="nav-item">
      <Tooltip className="nav-item" title="Home">
      <Link to="/" className="notif icon">
        OD <br/>
          {/* <img src={logo} width="50" height="50" className="logo"/> */}
        </Link>
      </Tooltip>
      </div>
      <Tooltip className="nav-item" title="Home">
        <Link to="/" className="home-nav icon">
        <Fab size="small" color="secondary" aria-label="home">
        <Home />
        </Fab>
        </Link>
      </Tooltip>
      <Tooltip className="nav-item" title="Search">
        {!isExpanded ? (
          <span onClick={() => setExpanded(true)}>
          <Fab size="small" color="secondary" aria-label="search">
            <Search className="icon"/>
            </Fab>
            </span>
        ) : (
          <Form onKeyDown={handleKeyDown}>
            <FormControl
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onBlur={() => setExpanded(false)}
            />
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
        )}
      </Tooltip>
      <Tooltip className="nav-item" title="Post">
      {/* TODO Set Link */}
      {/* {!isExpanded ? (
        <span onClick={() => setExpanded(true)}> */}
        <Fab size="small" color="secondary" aria-label="post">
          <AddCircle className="icon post"/>
          </Fab>
            {/* </span>
        ) : ( <CreatePostForm onClick={() => setExpanded(false)}/>)
        } */}
        </Tooltip>
      <Tooltip className="nav-item" title="Notifications">
      {/* TODO Set Link */}
        <Link to="/" className="notif icon">
        <Fab size="small" color="secondary" aria-label="notification">
          <NotificationsNoneSharp />
          </Fab>
        </Link>
      </Tooltip>
      <Tooltip className="nav-item" title="Messages">
        <Link to="/messages">
        <Fab size="small" color="secondary" aria-label="messages">
            <ThreeP className="icon"/>
            </Fab>
        </Link>
      </Tooltip>
      {user ? (
        <div>
          <Tooltip className="nav-item" title="Account">
          {/* NOTES: Add to show image? */}
            <Link to="/profile">
            <Fab size="small" color="secondary" aria-label="messages">
              <AccountCircle className="icon account"/>
              </Fab>
            </Link>
          </Tooltip>
          <Tooltip className="nav-item" title="Logout">
            <Link onClick={handleLogout}>
              Logout
            </Link>
          </Tooltip>
        </div>) : (
        <div className="nav-item">
          <Link onClick={() => setShowModal(true)}>
            Login/ Sign Up
          </Link>
        </div>
      )}
   
    </div>
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
  }

// export default AppNavbar;

export default AppNavbar;