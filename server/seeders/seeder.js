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

  await User.collection.insertMany(userData);

  await Post.collection.insertMany(postData);

  await Tag.collection.insertMany(staticTagData);

  console.log('All data including static tags, users, and posts seeded!');
  process.exit(0);
});