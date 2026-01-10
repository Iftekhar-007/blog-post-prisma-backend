import express from "express";
import { commentController } from "./comment.controller";
import authMiddle, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post(
  "/",
  authMiddle(userRole.ADMIN, userRole.User),
  commentController.createComment
);

router.get("/author/:authorId", commentController.getCommentByAuthorId);

router.get("/:commentId", commentController.getCommentById);

router.delete(
  "/:commentId",
  authMiddle(userRole.ADMIN, userRole.User),
  commentController.deleteComment
);

router.patch(
  "/:commentId",
  authMiddle(userRole.ADMIN, userRole.User),
  commentController.updateComment
);

router.patch(
  "/moderate/:commentId",
  authMiddle(userRole.ADMIN),
  commentController.modearetComment
);

export const commentRoute = router;
