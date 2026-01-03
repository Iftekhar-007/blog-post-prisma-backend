import { Request, Response } from "express";
import { postServices } from "./post.service";

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
    const result = await postServices.getAllPost({ search: searchStr });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "error", details: err });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
