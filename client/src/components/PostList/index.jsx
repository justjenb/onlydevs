import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UPDATE_LIKES, ADD_COMMENT, REPOST } from '../../utils/mutations';

const PostList = ({ 
  posts = [], 
  title, 
  searchResults = [], 
  showTitle = true, 
  showUsername = true 
}) => {
  const [updateLikes] = useMutation(UPDATE_LIKES);
  const [localPosts, setLocalPosts] = useState(posts);
  const [addComment] = useMutation(ADD_COMMENT);
  const [commentText, setCommentText] = useState({});
  const [repost] = useMutation(REPOST);

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  const handleAddComment = async (postId, text) => {
    try {
      const { data } = await addComment({ variables: { postId, text } });
      const updatedPost = data.addComment;
      setLocalPosts(localPosts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await updateLikes({ variables: { postId } });
      const updatedPost = data.updateLikes;
      setLocalPosts(localPosts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRepost = async (postId) => {
    try {
      const { data } = await repost({ variables: { postId } });
      const updatedPost = data.repost;
      setLocalPosts(localPosts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error(err);
    }
  };

  const displayPosts = searchResults.length > 0 ? searchResults : posts;

  if (!displayPosts.length) {
    return <h3 className="text-center">No Posts Yet</h3>;
  }

  return (
    <div className="mt-4">
      {showTitle && <h3 className="mb-4 text-center">{title}</h3>}
      {displayPosts.map((post) => (
        <div key={post._id} className="card mb-4">
          <div className="card-header">
            {showUsername && (
              <Link to={`/profiles/${post.postAuthor}`}>
                {post.postAuthor}
              </Link>
            )}
            <Link to={`/posts/${post._id}`} className="text-primary">
              <h5 className="card-title">{post.title}</h5>
            </Link>
            <small className="text-muted">
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </small>
          </div>
          <div className="card-body">
            <p className="card-text">
              {post.description.length > 25
                ? `${post.description.substring(0, 25)}...`
                : post.description}
            </p>
            <Link to={`/posts/${post._id}`} className="btn btn-primary">
              Read More
            </Link>
          </div>
          <div className="card-footer">
            <button className="btn btn-outline-primary mr-2" onClick={() => handleLike(post._id)}>
              Like
            </button>
            <button className="btn btn-outline-secondary mr-2" onClick={() => handleRepost(post._id)}>
              Repost
            </button>
            <input 
              className="form-control mr-2"
              type="text" 
              placeholder="Add a comment..." 
              value={commentText[post._id] || ''} 
              onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })} 
            />
            <button className="btn btn-outline-info" onClick={() => handleAddComment(post._id, commentText[post._id])}>
              Comment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

//   return (
//     <div>
//       {showTitle && <h3>{title}</h3>}
//       {displayPosts.map((post) => (
//         <div key={post._id} className="card mb-3">
//           <h4 className="card-header bg-primary text-light p-2 m-0">
//             {showUsername ? (
//               <Link className="text-light" to={`/profiles/${post.postAuthor}`}>
//                 {post.postAuthor} <br />
//                 <span style={{ fontSize: '1rem' }}>{post.title}</span>
//               </Link>
//             ) : (
//               <span style={{ fontSize: '1rem' }}>{post.title}</span>
//             )}
//           </h4>
//           <div className="card-body bg-light p-2">
//             <p>{post.description}</p>
//             {post.tags && post.tags.length > 0 ? (
//               post.tags.map((tag) => (
//                 <span key={tag._id}>{tag.name || "Unnamed Tag"}</span>
//               ))
//             ) : (
//               <span>No tags available</span>
//             )}
//           </div>
//           <button onClick={() => handleLike(post._id)}>Like</button>
//           <button onClick={() => handleRepost(post._id)}>Repost</button>
//           <input 
//             type="text" 
//             placeholder="Add a comment..." 
//             value={commentText[post._id] || ''} 
//             onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })} 
//           />
//           <button onClick={() => handleAddComment(post._id, commentText[post._id])}>Comment</button>
//         </div>
//       ))}
//     </div>
//   );
// };

PostList.propTypes = {
  posts: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  showUsername: PropTypes.bool,
  searchResults: PropTypes.array
};

export default PostList;