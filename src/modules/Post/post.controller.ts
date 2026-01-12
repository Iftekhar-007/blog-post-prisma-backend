import { Request, Response } from "express";
import { postServices } from "./post.service";
import { boolean, string } from "better-auth/*";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { userRole } from "../../middleware/auth";

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

    const { pageNumber, limitNumber, skip, sortBy, sortOrder } =
      paginationSortingHelper(req.query);

    const result = await postServices.getAllPost({
      search: searchStr,
      tags,
      isFeatued,
      status,
      authorId,
      pageNumber,
      limitNumber,
      skip,
      sortBy,
      sortOrder,
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "error", details: err });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await postServices.getPostById(id as string);

    res.status(200).json(result);
  } catch (err: any) {
    console.log(err.message);
    throw new Error("error occured", err);
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const result = await postServices.getMyPosts(user?.id as string);

    res.status(200).json({
      data: result,
    });
  } catch (err: any) {
    throw new Error("error occured", err);
  }
};

const updateMyPost = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { postId } = req.params;

    const isAdmin = req.user?.role === userRole.ADMIN;

    const result = await postServices.updateMyPost(
      userId as string,
      postId as string,
      req.body,
      isAdmin
    );

    res.status(200).json({
      data: result,
    });
  } catch (err: any) {
    throw new Error("error occured", err);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    const userId = user?.id;

    const { postId } = req.params;

    const isAdmin = user?.role === userRole.ADMIN;

    const result = await postServices.deletePost(
      userId as string,
      postId as string,
      isAdmin as boolean
    );

    res.status(200).json({
      data: result,
    });
  } catch (err: any) {
    throw new Error("error occured", err);
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updateMyPost,
  deletePost,
};
