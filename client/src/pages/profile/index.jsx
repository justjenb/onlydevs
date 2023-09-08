import { Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";

import CreatePostForm from "../../components/CreatePostForm";
import PostList from "../../components/PostList/index";

import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { UPDATE_BIO } from "../../utils/mutations";

import Auth from "../../utils/auth";

import "./Profile.css";

const ProfileInfo = ({ user, editingBio, handleEditBio, handleSaveBio, bioContent, handleBioChange }) => (
  <Card className="mb-4">
    <Card.Header>Profile Information</Card.Header>
    <Card.Body>
      <p>Id: {user._id}</p>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Bio: {user.bio}</p>
      {editingBio ? (
        <Form onSubmit={handleSaveBio}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={bioContent}
              onChange={handleBioChange}
              placeholder="Edit your bio here"
              required
            />
          </Form.Group>
          <Button type="submit" variant="success">Save</Button>
        </Form>
      ) : (
        <Button variant="primary" onClick={handleEditBio}>Edit Bio</Button>
      )}
    </Card.Body>
  </Card>
);

const Profile = () => {
  const [editingBio, setEditingBio] = useState(false);
  const [bioContent, setBio] = useState("");
  const { username: userParam } = useParams();
  const [
    updateBio,
    { data: updateBioData, loading: updateBioLoading, error: updateBioError },
  ] = useMutation(UPDATE_BIO);

  const handleEditBio = () => {
    setBio(user.bio);
    setEditingBio(true);
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
  };

  const handleSaveBio = async () => {
    try {
      console.log("Attempting to update bio..."); 
      const { data: mutationData } = await updateBio({ variables: { bio: bioContent } });
      console.log("Mutation response:", mutationData);
      if (mutationData?.updateBio) {
        user.bio = mutationData.updateBio.bio;
      }
      setEditingBio(false);

      refetch();
    } catch (err) {
      console.error("Error updating bio:", err);
    }
  };

  if (updateBioLoading) {
    console.log("Mutation in progress...");
  }

  if (updateBioError) {
    console.error("Error during mutation:", updateBioError);
  }

  if (updateBioData) {
    console.log("Mutation result:", updateBioData);
  }

  const queryOptions = userParam
    ? { query: QUERY_USER, variables: { username: userParam } }
    : { query: QUERY_ME };

    const {
      loading: queryLoading,
      error: queryError,
      data: queryData,
      refetch,
    } = useQuery(queryOptions.query, {
      variables: userParam ? { username: userParam } : {},
      fetchPolicy: "no-cache",
    });

  if (queryLoading) return <div>Loading...</div>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  const user = queryData?.me || queryData?.user || {};

  if (
    Auth.loggedIn() &&
    Auth.getProfile().authenticatedPerson.username === userParam
  ) {
    return <Navigate to="/profile" />;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <Container className="profile-container mt-4">
      <Row>
        <Col>
          <h2 className="text-center bg-dark text-light p-3 mb-4">
            Viewing {userParam ? `${user.username}'s` : "your"} profile.
          </h2>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <ProfileInfo 
            user={user}
            editingBio={editingBio}
            handleEditBio={handleEditBio}
            handleSaveBio={handleSaveBio}
            bioContent={bioContent}
            handleBioChange={handleBioChange}
          />
          <PostList
            posts={user.posts}
            title={`${user.username}'s posts...`}
            showTitle={true}
            showUsername={false}
          />
        </Col>
        <Col md={4}>
          <CreatePostForm />
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;