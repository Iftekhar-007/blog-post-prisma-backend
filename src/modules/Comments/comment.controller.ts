import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;

    req.body.authorId = authorId;
    const result = await commentService.createComment(req.body);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const commentController = {
  createComment,
};
