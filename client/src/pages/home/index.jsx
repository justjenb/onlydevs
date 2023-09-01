import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Row, Col, Layout, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";
import { UPDATE_LIKES } from '../../utils/mutations';
import PostList from "../../components/PostList/index";
import { useSearch } from '../../context/SearchContext';
import { Container, Box } from '@mui/material';

const { Header, Content } = Layout;
const { Text } = Typography;

const Home = () => {
  const [userDataGithub, setUserDataGithub] = useState(null);
  const [userDataGoogle, setUserDataGoogle] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  const { performSearch } = useSearch();
  const { searchResults } = useSearch();
  const { loading, error, data: queryData } = useQuery(QUERY_POSTS);
  const [updateLikes] = useMutation(UPDATE_LIKES);
  const loginWith = useRef(localStorage.getItem("loginWith"));
  const navigate = useNavigate();
  useEffect(() => {
    if (queryData && queryData.posts) {
      setAllPosts(queryData.posts);
    }
  }, [queryData]);
  useEffect(() => {
    performSearch(queryData, allPosts);
  }, [queryData, allPosts]);
  useEffect(() => {
    performSearch(queryData, allPosts);
  }, [queryData, allPosts]);

  useEffect(() => {
    if (searchResults.length > 0) {
      setAllPosts(searchResults);
    }
  }, [searchResults]);


  const handleLike = async (postId) => {
    try {
      const { data: mutationData } = await updateLikes({
        variables: { postId }
      });
      console.log('Updated likes:', mutationData);
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };
  
  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };
  
  if (!userDataGithub && !userDataGoogle) {
    return (
      <>
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
              <PostList posts={allPosts} title="Recent Posts" />
            </Col>
          </Row>
        </Content>
      </Layout>
      </>
    );
  }

  
  return (
    <>
    <Container fixed>
      <Box style={{ height: '100vh' }}>
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
        <div>Hello</div>
        <PostList posts={allPosts} title="Recent Posts" />
      </Box>
    </Container>
    </>
  );
};
export default Home;