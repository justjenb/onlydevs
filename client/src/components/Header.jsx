import React, { useEffect, useRef, useState } from "react";
import { QUERY_POSTS } from "../utils/queries";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { useSearch } from '../context/SearchContext';
import { Avatar, Button, Tooltip } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';

import {
  getAccessTokenGithub,
  getUserDataGithub,
  getUserDataGoogle,
  } from "../pages/home/services/home-services";

  const AppHeader = () => {
    const [userDataGithub, setUserDataGithub] = useState(null);
    const [userDataGoogle, setUserDataGoogle] = useState(null);
    const [allPosts, setAllPosts] = useState([]);
    
    const { searchResults } = useSearch();
    const { loading, error, data: queryData } = useQuery(QUERY_POSTS);
    
    useEffect(() => {
    if (queryData && queryData.posts) {
    setAllPosts(queryData.posts);
    }
    }, [queryData]);


  const loginWith = useRef(localStorage.getItem("loginWith"));
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    const accessToken = localStorage.getItem("accessToken");
  
  
    if (codeParam && !accessToken && loginWith.current === "GitHub") {
      getAccessTokenGithub(codeParam).then((resp) => {
      localStorage.setItem("accessToken", resp.access_token);
      getUserDataGithub(resp.access_token).then((resp) => {
      setUserDataGithub(resp);
      });
    });
    } else if (codeParam && accessToken && loginWith.current === "GitHub") {
      getUserDataGithub(accessToken).then((resp) => {
      localStorage.setItem("accessToken", accessToken);
      setUserDataGithub(resp);
      });
    }
   }, [loginWith]);
  
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken && loginWith.current === "Google") {
      getUserDataGoogle(accessToken).then((resp) => {
      setUserDataGoogle(resp);
      });
    }
  }, [loginWith]);

  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };

  if (!userDataGithub && !userDataGoogle) {
    return (
      <Container fluid>
        <Row>
          <Col className="text-end">
            <Avatar id="header-avatar" />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row>
      <Col className="d-flex justify-content-end">
          <Avatar
            src={
              loginWith.current === "GitHub"
                ? userDataGithub?.avatar_url
                : userDataGoogle?.picture
            }
          />
        </Col>
      </Row>
    </Container>
  );
  
}

export default AppHeader;