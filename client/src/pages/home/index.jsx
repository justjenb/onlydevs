import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography } from "antd";
const { Header, Content } = Layout;
const { Text } = Typography;
import { LogoutOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { QUERY_POSTS } from "../../utils/queries";
import { UPDATE_LIKES } from '../../utils/mutations';
import PostList from "../../components/PostList/index";
import { useSearch } from '../../context/SearchContext';
import { Grid } from "@mui/material";



const Home = () => {
  const [userDataGithub, setUserDataGithub] = useState(null);
  const [userDataGoogle, setUserDataGoogle] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
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
    if (searchResults.length > 0) {
      setAllPosts(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    if (queryData && queryData.posts) {
      setAllPosts(queryData.posts);
    }
  }, [queryData]);
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


// console.log("Posts" , allPosts)
// If user data is not available, show a log in message
if (!userDataGithub && !userDataGoogle) {
return (
  <Grid container rowSpacing={2}>
    <Grid item xs={12} className="main-content">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <PostList posts={allPosts} title="Recent Posts" />
    </Grid>
</Grid>
// </Content>
);
}
// If user data is available, show user details
return (
<Grid container rowSpacing={2}>
  <Grid item xs={12} className="main-content">
    <div>Hello</div>
    <PostList posts={allPosts} title="Recent Posts" />
  </Grid>
</Grid>
);


};

export default Home;