import React, { useState } from 'react';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

function CreatePostForm() {
  const [postContent, setPostContent] = useState('');

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: postContent }),
      });

      if (response.ok) {
        console.log('Post created successfully');
        setPostContent(''); 
      } else {
        console.log('Error creating post');
      }
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
      <Button type='submit' variant='success'>
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;
