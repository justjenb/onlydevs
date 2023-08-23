import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Avatar, Row, Col, Layout, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { getAccessTokenGithub, getUserDataGithub, getUserDataGoogle } from "./services/home-services";

const { Header, Content } = Layout;
const { Text } = Typography;

const Home = () => {
  const [userDataGithub, setUserDataGithub] = useState(null);
  const [userDataGoogle, setUserDataGoogle] = useState(null);

  const loginWith = useRef(localStorage.getItem("loginWith"));
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");
    const accessToken = localStorage.getItem("accessToken");

    if (codeParam && !accessToken && loginWith.current === "GitHub") {
      getAccessTokenGithub(codeParam).then(resp => {
        localStorage.setItem("accessToken", resp.access_token);
        getUserDataGithub(resp.access_token).then(resp => {
          setUserDataGithub(resp);
        });
      });
    } else if (codeParam && accessToken && loginWith.current === "GitHub") {
      getUserDataGithub(accessToken).then(resp => {
        localStorage.setItem("accessToken", accessToken);
        setUserDataGithub(resp);
      });
    }
  }, [loginWith]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken && loginWith.current === "Google") {
      getUserDataGoogle(accessToken).then(resp => {
        setUserDataGoogle(resp);
      });
    }
  }, [loginWith]);

  const setLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginWith");
    navigate("/");
  };

  // If user data is not available, show a log in message
  if (!userDataGithub && !userDataGoogle) {
    return (
      <Layout>
        <Content style={{ padding: '20px', textAlign: 'center' }}>
          <Row justify="center">
            <Col>
              <Text strong>Please log in.</Text>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  // If user data is available, show user details
  return (
        <Layout>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Avatar
                    size="large"
            src={loginWith.current === "GitHub" ? userDataGithub?.avatar_url : userDataGoogle?.picture}
          />
            <Button
                    type="primary" 
                    icon={<LogoutOutlined />} 
              onClick={setLogOut}
            >
              Log out
            </Button>
            </Header>

            <Content style={{ padding: '20px', textAlign: 'center' }}>
                <Row justify="center">
                    <Col>
                        <Text strong>Login with {loginWith.current}</Text>
                    </Col>
                </Row>
            </Content>
        </Layout>
  );
}

export default Home;
