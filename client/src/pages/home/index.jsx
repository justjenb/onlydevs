import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";
import { UPDATE_LIKES } from '../../utils/mutations';
import PostList from "../../components/PostList/index";
import { useSearch } from '../../context/SearchContext';
import { Container, Row, Col, Button } from 'react-bootstrap';

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

  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };

  if (!userDataGithub && !userDataGoogle) {
    return (
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col className="text-center">
            <h3>Welcome to OnlyDevs!</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            <PostList posts={allPosts} title="Recent Posts" />
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row style={{ height: '100vh', overflowY: 'auto' }}>
        <Col>
          <img
            src={loginWith.current === "GitHub" ? userDataGithub?.avatar_url : userDataGoogle?.picture}
            alt="User Avatar"
            className="img-thumbnail"
          />
          <Button variant="primary" onClick={setLogOut}>Log out</Button>
          <div>Hello</div>
          <PostList posts={allPosts} title="Recent Posts" />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
