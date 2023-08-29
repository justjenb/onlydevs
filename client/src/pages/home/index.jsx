import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Row, Col, Layout, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";
import { UPDATE_LIKES } from '../../utils/mutations';
import AppNavbar from "../../components/Navbar";
import PostList from "../../components/PostList/index";

import {
  getAccessTokenGithub,
  getUserDataGithub,
  getUserDataGoogle,
} from "./services/home-services";

const { Header, Content } = Layout;
const { Text } = Typography;

const Home = () => {
  const [userDataGithub, setUserDataGithub] = useState(null);
  const [userDataGoogle, setUserDataGoogle] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const { loading, error, data: queryData } = useQuery(QUERY_POSTS);
  const [updateLikes] = useMutation(UPDATE_LIKES);

  useEffect(() => {
    if (queryData && queryData.posts) {
      setAllPosts(queryData.posts); 
    }
  }, [queryData]);

  const handleLike = async (postId) => {
    try {
      // console.log("Post ID:", postId)
      const { data: mutationData } = await updateLikes({
        variables: { postId }
      });
      console.log('Updated likes:', mutationData);
    
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

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
  // console.log("Posts" , allPosts)
  // If user data is not available, show a log in message
  if (!userDataGithub && !userDataGoogle) {
    return (
      <Layout>
        <Content style={{ padding: "20px", textAlign: "center" }}>
          <Row justify="center">
            <Col>
              <Text strong>Welcome to OnlyDevs!</Text>
            </Col>
          </Row>
          <Row>
            <Col>
              {loading && <div>Loading...</div>}
              {error && <div>Error: {error.message}</div>}
              {allPosts.length > 0 && (
                <div>
                  <h3>Posts</h3>
                  
                  <ul>
                    {allPosts.map((post, index) => (
                      //  console.log("Current post object:", post),
                      <li key={index}>
                        <strong>Title:</strong> {post.title} <br />
                        <strong>Description:</strong> {post.description} <br />
                        <button onClick={() => handleLike(post._id)}>Like</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
  

  // If user data is available, show user details
  return (
    <Layout>
      <AppNavbar />
      <Content style={{ padding: "20px", textAlign: "center" }}>
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            size="large"
            src={
              loginWith.current === "GitHub"
                ? userDataGithub?.avatar_url
                : userDataGoogle?.picture
            }
          />
          <Button type="primary" icon={<LogoutOutlined />} onClick={setLogOut}>
            Log out
          </Button>
        </Header>
        <div>Hello</div>
        <PostList posts={allPosts} title="Recent Posts" />
      </Content>
    </Layout>
  );
};

export default Home;
