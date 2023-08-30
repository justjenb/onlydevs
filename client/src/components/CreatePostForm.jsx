import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { CREATE_TAG, CREATE_POST, UPDATE_POST_TAGS } from "../utils/mutations";
import { GET_ALL_TAGS } from "../utils/queries";

function CreatePostForm() {
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

    console.log("postContent data:", postContent);

    try {
      const { data } = await createPost({
        variables: { content: postContent },
      });

    console.log('Post created successfully:', data.createPost);
    setPostContent('');

    const defaultDescription = "This is a user-generated tag.";

    const newTags = [];
    for (let tag of selectedTags) {
      if (!allTags.find(existingTag => existingTag.name === tag.name)) {
        // Tag does not exist, create it
        const { data: tagData } = await addTag({
          variables: { 
            name: tag.name,
            description: defaultDescription
          },
        });
        newTags.push(tagData.createTag);
      }
    }
  
    handleUpdatePostTags([...selectedTags, ...newTags], data.createPost._id);

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
