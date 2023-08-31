import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { ADD_POST } from "../utils/mutations";

function CreatePostForm() {
  const [postContent, setPostContent] = useState("");
  const [createPost] = useMutation(ADD_POST);

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    console.log("postContent data:", postContent);

    try {
      const { data: postData } = await createPost({
        variables: { description: postContent },
      });

      console.log('Post created successfully:', postData.createPost);
      setPostContent('');

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Form onSubmit={handlePostSubmit}>
      <Form.Group className="mb-3">
        <Form.Control
          as="textarea"
          rows={4}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="Write post here"
          required
        />
      </Form.Group>
      <Button type="submit" variant="success">
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;
