import { Post, PostStatus } from "../../../generated/prisma/client";
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
  status: PostStatus | undefined;
  authorId: string | undefined;
  pageNumber: number;
  limitNumber: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: "asc" | "desc" | undefined;
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

  if (payload.status) {
    andOptions.push({ status: { equals: payload.status } });
  }

  if (payload.authorId) {
    andOptions.push({
      authorId: { contains: payload.authorId },
    });
  }

  const result = await prisma.post.findMany({
    take: payload.limitNumber,
    skip: payload.skip,

    where: {
      AND: andOptions,
    },

    orderBy:
      payload.sortBy && payload.sortOrder
        ? {
            [payload.sortBy]: payload.sortOrder,
          }
        : { createdAt: "desc" },
  });

  return result;
};

export const postServices = {
  createPost,
  getAllPost,
};

// test comment
// content = (1,2,3,4,5,6,7),   (8,9,10,11,12,13,14),  (15,16,17,18,19,20,21)
// page =           1,                    2,                      3
// limit = 7
// skip = (page-1) * limit
// another test comment
