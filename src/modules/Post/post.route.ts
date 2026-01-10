import express from "express";
import { postController } from "./post.controller";

import authMiddle, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", authMiddle(userRole.User), postController.createPost);

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  authMiddle(userRole.User, userRole.ADMIN),
  postController.getMyPosts
);

router.get("/:id", postController.getPostById);

export const postRoute = router;
