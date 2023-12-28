const express = require("express");
const passport = require("passport");
const postController = require("../controllers/postController");
const router = express.Router();

router.use(passport.authenticate("jwt", { session: false }));

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  postController.createPost
);
router.put(
  "/update/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.updatePost
);
router.get(
  "/get/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.getPost
);
router.delete(
  "/delete/:postId",
  passport.authenticate("jwt", { session: false }),
  postController.deletePost
);
router.get(
  "/getPosts",
  passport.authenticate("jwt", { session: false }),
  postController.getAllPosts
);
router.get(
  "/counts",
  passport.authenticate("jwt", { session: false }),
  postController.getPostCounts
);
module.exports = router;
