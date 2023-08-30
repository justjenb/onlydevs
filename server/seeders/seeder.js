const mongoose = require('mongoose');
const db = require('../config/connection');
const { User, Post, Tag } = require('../models');

const staticTagData = require('./tags.json');
const userData = require('./users.json');
const postData = require('./posts.json');

db.once('open', async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Tag.deleteMany({});

  const userDocs = await User.insertMany(userData);  

  const tagDocs = await Tag.insertMany(staticTagData);

  const mappedPosts = postData.map((post, index) => {
    const user = userDocs[index % userDocs.length];
    const tagNames = post.tags;
    const postTags = tagDocs.filter(tagDoc => tagNames.includes(tagDoc.name));
    return {
      ...post,
      user: user._id,
      tags: postTags.map(tag => tag._id)
    };
  });

  await Post.insertMany(mappedPosts);

  console.log('All data including static tags, users, and posts seeded!');
  process.exit(0);
});