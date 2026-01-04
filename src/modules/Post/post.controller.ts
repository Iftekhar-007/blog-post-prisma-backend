import { Request, Response } from "express";
import { postServices } from "./post.service";
import { boolean, string } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "unauhtorized",
      });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "error", details: error });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchStr = typeof search === "string" ? search : undefined;

    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    const isFeatued = req.query.isFeatued
      ? req.query.isFeatued === "true"
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const result = await postServices.getAllPost({
      search: searchStr,
      tags,
      isFeatued,
      status,
      authorId,
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "error", details: err });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
