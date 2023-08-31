import React, { useEffect, useRef, useState } from "react";
import { QUERY_POSTS } from "../utils/queries";
import { Link, useNavigate } from "react-router-dom";
import { Layout, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { useSearch } from '../context/SearchContext';
import { Grid } from "@mui/material";
import {Avatar, Button, Tooltip} from '@mui/material';
const { Text } = Typography;

import {
  getAccessTokenGithub,
  getUserDataGithub,
  getUserDataGoogle,
  } from "../pages/home/services/home-services";

  // const { Header } = Layout;

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
      <div id="header">
            <Tooltip className="nav-item" title="Home">
      <Link to="/" className="notif icon">
        OD <br/>
          {/* <img src={logo} width="50" height="50" className="logo"/> */}
        </Link>
      </Tooltip>
        Welcome to OnlyDevs!
        <Avatar
          size="large"
          id="header-avatar"
        />
        </div>
    );}

    return (
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <Avatar
          size="large"
          src={
              loginWith.current === "GitHub"
              ? userDataGithub?.avatar_url
              : userDataGoogle?.picture
              }
            />
        <Button icon={<LogoutOutlined />} onClick= {setLogOut}>
        Log out
        </Button> 
  </div>
        );
            }

            export default AppHeader;