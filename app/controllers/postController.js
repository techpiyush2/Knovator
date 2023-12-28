const Post = require("../models/Post");
const { validatePost } = require("../utils/validation");

const createPost = async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }

  try {
    const newPost = new Post({
      title: req.body.title,
      body: req.body.body,
      createdBy: req.user._id,
      location: {
        type: "Point",
        coordinates: [req.body.latitude, req.body.longitude],
      },
    });

    await newPost.save();
    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: { post: newPost },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const updatePost = async (req, res) => {
  const { error } = validatePost(req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }

  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Checking if the user updating the post is the same user who created it
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized. You can only update your own posts.",
      });
    }

    post.title = req.body.title;
    post.body = req.body.body;
    post.location = {
      type: "Point",
      coordinates: [req.body.latitude, req.body.longitude],
    };

    await post.save();
    res.json({
      status: "success",
      message: "Post updated successfully",
      data: { post },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Checking if the user retrieving the post is the same user who created it
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized. You can only view your own posts.",
      });
    }

    res.json({ status: "success", data: { post } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res
        .status(404)
        .json({ status: "error", message: "Post not found" });
    }

    // Checking if the user deleting the post is the same user who created it
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Unauthorized. You can only delete your own posts.",
      });
    }

    await post.remove();
    res.json({ status: "success", message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const posts = await Post.find({ createdBy: req.user._id })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ createdBy: req.user._id });
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      status: "success",
      data: { posts, page, limit, totalPosts, totalPages },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


const getPostCounts = async (req, res) => {
  try {
    const activeCount = await Post.countDocuments({ createdBy: req.user._id, active: true });
    const inactiveCount = await Post.countDocuments({ createdBy: req.user._id, active: false });

    res.json({
      status: 'success',
      data: {
        activeCount,
        inactiveCount,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

module.exports = { createPost, updatePost, getPost, deletePost, getAllPosts, getPostCounts };

