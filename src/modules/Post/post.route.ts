import express from "express";
import { postController } from "./post.controller";

import authMiddle, { userRole } from "../../middleware/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  authMiddle(userRole.User, userRole.ADMIN),
  postController.getMyPosts
);

router.get("/:id", postController.getPostById);

router.post("/", authMiddle(userRole.User), postController.createPost);

router.patch(
  "/:postId",
  authMiddle(userRole.User, userRole.ADMIN),
  postController.updateMyPost
);

router.delete(
  "/:postId",
  authMiddle(userRole.ADMIN, userRole.User),
  postController.deletePost
);

export const postRoute = router;
