// controllers/postController.js

const Post = require('../models/postModel');

exports.getAll = async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
};

exports.getOne = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

exports.create = async (req, res) => {
  const { title, content } = req.body;
  const newPost = new Post({ title, content });
  await newPost.save();
  res.status(201).json(newPost);
};

exports.update = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { title, content },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
};

exports.remove = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted' });
};
