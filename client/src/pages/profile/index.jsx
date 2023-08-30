import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import CreatePostForm from "../../components/CreatePostForm";
import PostList from "../../components/PostList";

import { QUERY_USER, QUERY_ME } from "../../utils/queries";

import Auth from "../../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();
  
  const queryOptions = userParam
    ? { query: QUERY_USER, variables: { username: userParam } }
    : { query: QUERY_ME };

  const { loading, error, data } = useQuery(queryOptions.query, {
    variables: userParam ? { username: userParam } : {},
    fetchPolicy: "no-cache"
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error.message}</p>;

  const user = data?.me || data?.user || {};

  console.log("user data:", user);
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
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        <div className="col-12 col-md-10 mb-5">
          <PostList
            posts={user.posts}
            title={`${user.username}'s posts...`}
            showTitle={false}
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
