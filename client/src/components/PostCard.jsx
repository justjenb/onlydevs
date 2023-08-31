import React from "react";
import { UPDATE_LIKES } from '../utils/mutations';
import { useQuery, useMutation } from "@apollo/client";
import { Item, Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography } from '@mui/material';
import { Favorite } from '@mui/icons-material';

function PostCard(props) {

  const [updateLikes] = useMutation(UPDATE_LIKES);
  const handleLike = async (postId) => {
    try {
      // console.log("Post ID:", postId)
      const { data: mutationData } = await updateLikes({
        variables: { postId }
      });
      console.log('Updated likes:', mutationData);
    
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  return (
    <Item key={props.key}>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar aria-label="">
              OD
            </Avatar>}
          title={props.title}
          />
        <CardMedia
          component="img"
          height="194"
          image=""
          alt=""
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {props.description}
          </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like" OnClick={() => handleLike(post._id)}>
          <Favorite />
        </IconButton>

      </CardActions>
      </Card>
    </Item>
  )
}

export default PostCard;

       {/*  TODO: If we want to repost
          <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}