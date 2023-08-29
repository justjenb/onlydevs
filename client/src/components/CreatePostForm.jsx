import React, { useState, useQuery } from 'react';
import { Form, Button } from 'react-bootstrap';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useMutation } from '@apollo/client';
import { CREATE_POST, UPDATE_POST_TAGS } from '../utils/mutations';
import { GET_ALL_TAGS } from '../utils/queries';

function CreatePostForm() {
  const [postContent, setPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [createPost] = useMutation(CREATE_POST);
  const [updatePostTags] = useMutation(UPDATE_POST_TAGS);
  const { loading, error, data } = useQuery(GET_ALL_TAGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const allTags = data.getAllTags;

  const handleTagChange = (event, newValue) => {
    setSelectedTags(newValue);
  };

  const handleUpdatePostTags = (selectedTags, newPostId) => {
    updatePostTags({
      variables: {
        postId: newPostId,
        tags: selectedTags.map(tag => tag._id),
      },
    })
    .then(response => {
      console.log('Post updated:', response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  };


  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await createPost({
        variables: { content: postContent },
      });

      console.log('Post created successfully:', data.createPost);
      setPostContent('');

      handleUpdatePostTags(selectedTags, data.createPost._id);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form onSubmit={handlePostSubmit}>
      <Form.Group className='mb-3'>
        <Form.Control
          as='textarea'
          rows={4}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder='Write post here'
          required
        />
      </Form.Group>
      <Autocomplete
        multiple
        id="tags-filled"
        options={allTags}
        getOptionLabel={(option) => option.name}
        value={selectedTags}
        onChange={handleTagChange}
        renderInput={(params) => (
          <TextField {...params} label="Tags" placeholder="Add tags" />
        )}
      />
      <Button type='submit' variant='success'>
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;