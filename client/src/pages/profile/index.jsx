import { Navigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import CreatePostForm from "../../components/CreatePostForm";
import PostList from "../../components/PostList/index";

import { QUERY_USER, QUERY_ME } from "../../utils/queries";
import { UPDATE_BIO } from "../../utils/mutations";

import Auth from "../../utils/auth";

import "./Profile.css";

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
    <div className="profile-container">
    <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
            Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        <div className="col-12 col-md-10 mb-3 p-3">
            <h4>Profile Information</h4>
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
                    <Button type="submit" variant="success">
                        Save
                    </Button>
                </Form>
            ) : (
                <Button variant="primary" onClick={handleEditBio}>
                    Edit Bio
                </Button>
            )}
        </div>

        <div className="col-12 col-md-10 mb-5">
          <PostList
            posts={user.posts}
            title={`${user.username}'s posts...`}
            showTitle={true}
            showUsername={false}
          />
        </div>

        {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ border: "1px dotted #1a1a1a" }}
          >
            <CreatePostForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
