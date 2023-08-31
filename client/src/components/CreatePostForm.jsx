import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CREATE_TAG, CREATE_POST, UPDATE_POST_TAGS } from "../utils/mutations";
import { GET_ALL_TAGS } from "../utils/queries";

function CreatePostForm({ user }) {
  const [postContent, setPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [createPost] = useMutation(CREATE_POST);
  const [addTag] = useMutation(CREATE_TAG);
  const [updatePostTags] = useMutation(UPDATE_POST_TAGS);
  const { loading, error, data } = useQuery(GET_ALL_TAGS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const allTags = data.getAllTags;

  const handleTagChange = (event, newValue) => {
    console.log("Tags selected:", newValue);
    setSelectedTags(newValue);
};

  const handleUpdatePostTags = (selectedTags, newPostId) => {
    updatePostTags({
      variables: {
        postId: newPostId,
        tags: selectedTags.map((tag) => tag._id),
      },
    })
      .then((response) => {
        console.log("Post updated:", response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
  
    console.log("Starting post submission.");
    console.log("postContent data:", postContent);
    console.log("Selected tags:", selectedTags);
  
    const defaultDescription = "This is a user-generated tag.";
    const newTags = [];
  
    try {
      // Create non-existing tags first
      for (let tag of selectedTags) {
        console.log(`Checking if tag '${tag.name}' exists.`);
        if (!allTags.find(existingTag => existingTag.name === tag.name)) {
          console.log(`Tag '${tag.name}' not found, attempting to create.`);
          const { data: tagData } = await addTag({
            variables: { 
              name: tag.name,
              description: defaultDescription
            },
          });
          newTags.push(tagData.createTag);
          console.log(`Tag '${tag.name}' created successfully:`, tagData.createTag);
        } else {
          console.log(`Tag '${tag.name}' already exists.`);
        }
      }
  
      console.log("Attempting to create post with all tags (old and new).");
      const { data } = await createPost({
        variables: {
          input: {
            user: user.id,
            postText: postContent,
            tags: [...selectedTags, ...newTags].map(tag => tag._id)
          }
        }
      });      
      console.log('Post created successfully:', data.createPost);
      setPostContent('');
  
      console.log("Attempting to update post with tags (if needed).");
      handleUpdatePostTags([...selectedTags, ...newTags], data.createPost._id);
      console.log("Post updated with tags successfully.");
  
    } catch (error) {
      console.error('An error occurred:', error);
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
      <Autocomplete
        multiple
        freeSolo
        id="tags-filled"
        options={allTags}
        getOptionLabel={(option) => option.name}
        value={selectedTags}
        onChange={handleTagChange}
        renderInput={(params) => (
          <TextField {...params} label="Tags" placeholder="Add tags" />
        )}
      />
      <Button type="submit" variant="success">
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;
