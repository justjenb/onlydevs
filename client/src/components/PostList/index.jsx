import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_LIKES } from '../../utils/mutations';

const PostList = ({ 
  posts,
  title, 
  showTitle = true, 
  showUsername = true }) => {

  const [updateLikes] = useMutation(UPDATE_LIKES);
  const [localPosts, setLocalPosts] = useState(posts);


  const handleLike = async (postId) => {
    try {
      const { data } = await updateLikes({
        variables: { postId }
      });
      const updatedPost = data.updateLikes;
      // update local state
      setLocalPosts(
        localPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err){
      console.error(err);
    }
  };

  if (!posts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {posts.map((post) => (
        <div key={post._id} className="card mb-3">
          <h4 className="card-header bg-primary text-light p-2 m-0">
            {showUsername ? (
              <Link className="text-light" to={`/profiles/${post.postAuthor}`}>
                {post.postAuthor} <br />
                <span style={{ fontSize: '1rem' }}>
                  had this thought on {post.createdAt}
                </span>
              </Link>
            ) : (
              <>
                <span style={{ fontSize: '1rem' }}>
                  You had this thought on {post.createdAt}
                </span>
              </>
            )}
          </h4>
          <div className="card-body bg-light p-2">
            <p>{post.postText}</p>
          </div>
          <button onClick={() => handleLike(post._id)}>Like</button>
          <Link
            className="btn btn-primary btn-block btn-squared"
            to={`/posts/${post._id}`}
          >
            Join the discussion on this thought.
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PostList;
