import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_LIKES, ADD_COMMENT, REPOST } from '../../utils/mutations';


const PostList = ({ 
  posts,
  title, 
  showTitle = true, 
  showUsername = true 
}) => {
  const [updateLikes] = useMutation(UPDATE_LIKES);
  const [localPosts, setLocalPosts] = useState(posts);
  const [addComment] = useMutation(ADD_COMMENT);
  const [commentText, setCommentText] = useState('');
  const [repost] = useMutation(REPOST);

  const handleAddComment = async (postId, text) => {
    try {
      const { data } = await addComment({
        variables: { postId, text }
      });
      const updatedPost = data.addComment;
      setLocalPosts(
        localPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error(err);
      console.log('this-is-a-test');
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await updateLikes({
        variables: { postId }
      });
      const updatedPost = data.updateLikes;
      setLocalPosts(
        localPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
      console.error(err);
      console.log('this-is-another-test');
    }
  };

  const handleRepost = async (postId) => {
    try {
      const { data } = await repost({
        variables: { postId }
      });
      const updatedPost = data.repost;
      setLocalPosts(
        localPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch (err) {
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
          <button onClick={() => handleRepost(post._id)}>Repost</button>
          <input 
            type="text" 
            placeholder="Add a comment..." 
            value={commentText} 
            onChange={(e) => setCommentText(e.target.value)} 
          />
          <button onClick={() => handleAddComment(post._id, commentText)}>Comment</button>
          {post.comments && post.comments.map((comment, index) => (
            <div key={index}>
              <p>{comment.text} - {comment.username}</p>
            </div>
          ))}
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

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  showUsername: PropTypes.bool,
};

export default PostList;
