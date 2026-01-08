import express from "express";
import { commentController } from "./comment.controller";
import authMiddle, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddle(userRole.ADMIN, userRole.User),
  commentController.createComment
);

export const commentRoute = router;
