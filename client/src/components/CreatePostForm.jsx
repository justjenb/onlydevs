import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { ADD_POST } from "../utils/mutations";
import { GET_ALL_TAGS } from "../utils/queries";

function CreatePostForm() {
  const [postContent, setPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [createPost] = useMutation(ADD_POST);

  const { loading, error, data } = useQuery(GET_ALL_TAGS);

  useEffect(() => {
      setSelectedTags(["64eff07ec41fe9085ca94b70"]);  
    }, []);

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    
    console.log("postContent data:", postContent);

    try {
      const { data: postData } = await createPost({
        variables: { description: postContent, tags: selectedTags },
      });

      console.log('Post created successfully:', postData.createPost);
      setPostContent('');
      setSelectedTags([]);


    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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
      <Form.Group className="mb-3">
      <Form.Control as="select" multiple onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions).map(option => option.value);
        console.log("Selected tags:", selected);
        setSelectedTags(selected);
      }}>
        {data && data.getAllTags ? (
          data.getAllTags.map(tag => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))
        ) : (
          <option disabled>No tags available</option>
        )}
      </Form.Control>
    </Form.Group>
      <Button type="submit" variant="success">
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;
