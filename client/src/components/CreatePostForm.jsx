import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Form, Button } from "react-bootstrap";
import { ADD_POST } from "../utils/mutations";


function CreatePostForm() {
  const [postContent, setPostContent] = useState("");
  const [createPost] = useMutation(ADD_POST);
  const [tags, setTags] = useState([]);
  

  const handlePostSubmit = async (event) => {
    event.preventDefault();

    console.log("Tags before sending:", tags);
    console.log("postContent data:", postContent);

    try {
      const { data: postData } = await createPost({
        variables: { description: postContent, tags: tags },
      });
      console.log("Tags before sending:", tags);
      console.log('Post created successfully:', postData.createPost);
      setPostContent('');

    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.includes("#")) {
    const newSuggestions = allPossibleSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(value.toLowerCase().replace("#", ""))
    );
    setSuggestions(newSuggestions);
  }else {
    setSuggestions([]);
  }
  };

  const handleKeyDown = (e) => {
    console.log("Key pressed: ", e.key);
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const nextIndex = (focusedSuggestionIndex + 1) % suggestions.length;
      setFocusedSuggestionIndex(nextIndex);
    } else if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      const nextIndex = (focusedSuggestionIndex - 1 + suggestions.length) % suggestions.length;
      setFocusedSuggestionIndex(nextIndex);
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (focusedSuggestionIndex !== -1) {
        handleSuggestionClick(suggestions[focusedSuggestionIndex]);
      }
      handleSearch();
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
      <Form.Group className="mb-3">
      <Form.Control
        type="text"
        value={tags.join(', ')}
        onChange={(e) => {
          console.log("Input changed:", e.target.value);
          setTags(e.target.value.split(', '));
        }}
        placeholder="Tags (comma-separated)"
      />
    </Form.Group>
      <Button type="submit" variant="success">
        Post
      </Button>
    </Form>
  );
}

export default CreatePostForm;
