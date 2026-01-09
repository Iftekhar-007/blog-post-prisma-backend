import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });

  return result;
};

const getCommentById = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          content: true,
          thumbnail: true,
          views: true,
          authorId: true,
        },
      },
    },
  });

  return result;
};

const getCommentByAuthorId = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          content: true,
          thumbnail: true,
          views: true,
          authorId: true,
        },
      },
    },
  });

  return result;
};

const deleteComment = async (userId: string, commentId: string) => {
  const confirmData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: userId,
    },
    select: {
      id: true,
      content: true,
    },
  });

  if (!confirmData) {
    throw new Error("Comment not found");
  }

  const result = await prisma.comment.delete({
    where: {
      id: confirmData.id,
    },
  });

  return result;
};

const updateComment = async (
  commentId: string,
  data: { content: string; commentStatus: CommentStatus },
  authorId: string
) => {
  const confirmCommentData = await prisma.comment.findFirst({
    where: {
      id: commentId,
      authorId: authorId,
    },
  });

  if (!confirmCommentData) {
    throw new Error(
      "comment not found cz comment id or author id isn't valid!!!!!"
    );
  }

  const result = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: data.content,
      status: data.commentStatus,
    },
  });

  return result;
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  deleteComment,
  updateComment,
};
