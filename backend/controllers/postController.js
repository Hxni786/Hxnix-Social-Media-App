const Post = require('../models/Post');

// GET /api/posts
async function getPosts(req, res) {
  try {
    const posts = await Post.getAllPosts();
    res.json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error('[Controller] getPosts error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch posts', error: err.message });
  }
}

// GET /api/posts/:id
async function getPost(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    const post = await Post.getPostById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: `Post with id ${id} not found` });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    console.error('[Controller] getPost error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch post', error: err.message });
  }
}

// POST /api/posts
async function createPost(req, res) {
  try {
    const { title, body, userId } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'title and body are required' });
    }
    const post = await Post.createPost({ title, body, userId });
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error('[Controller] createPost error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create post', error: err.message });
  }
}

// DELETE /api/posts/:id
async function deletePost(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid post ID' });
    }
    const deleted = await Post.deletePost(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: `Post with id ${id} not found` });
    }
    res.json({ success: true, message: `Post ${id} deleted successfully` });
  } catch (err) {
    console.error('[Controller] deletePost error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete post', error: err.message });
  }
}

module.exports = { getPosts, getPost, createPost, deletePost };
