import { Post } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "updatedAt" | "createdAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async (payload: {
  search: string | undefined;
  tags: string[];
  isFeatued: boolean | undefined;
}) => {
  const andOptions: PostWhereInput[] = [];

  if (payload.search) {
    andOptions.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    andOptions.push({
      tags: {
        hasEvery: payload.tags as string[],
      },
    });
  }

  if (typeof payload.isFeatued === "boolean") {
    andOptions.push({ isFeatued: payload.isFeatued });
  }
  const result = await prisma.post.findMany({
    where: {
      AND: andOptions,
    },
  });

  return result;
};

export const postServices = {
  createPost,
  getAllPost,
};
