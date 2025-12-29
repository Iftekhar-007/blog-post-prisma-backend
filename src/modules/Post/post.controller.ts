import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "error", details: error });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getAllPost();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "error", details: err });
  }
};

export const postController = {
  createPost,
  getAllPost,
};
