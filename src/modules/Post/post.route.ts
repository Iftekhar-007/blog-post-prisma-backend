import express, { NextFunction, Request, Response } from "express";
import { postController } from "./post.controller";
import { auth } from "../../lib/auth";
import authMiddle, { userRole } from "../../middleware/auth";

const router = express.Router();

router.post("/", authMiddle(userRole.User), postController.createPost);

router.get("/", postController.getAllPost);

export const postRoute = router;
