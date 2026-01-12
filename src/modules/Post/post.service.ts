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
  sortBy: string;
  sortOrder: "asc" | "desc";
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

    orderBy: {
      [payload.sortBy]: payload.sortOrder,
    },

    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andOptions,
    },
  });

  return {
    data: result,
    pagination: {
      totalItems: total,
      pageNumber: payload.pageNumber,
      limit: payload.limitNumber,
      totalPage: Math.ceil(total / payload.limitNumber),
    },
  };
};

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            comments: {
              include: {
                comments: true,
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return postData;
  });

  return result;
};

const getMyPosts = async (userId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
      status: "Active",
    },
    select: {
      id: true,
    },
  });
  const result = await prisma.post.findMany({
    where: {
      authorId: userId,
    },
  });

  const total = await prisma.post.aggregate({
    _count: {
      id: true,
    },
    where: {
      authorId: userId,
    },
  });

  return { data: result, total };
};

const updateMyPost = async (
  userId: string,
  postId: string,
  data: Partial<Post>,
  isAdmin: boolean
) => {
  const confirmPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!confirmPost) {
    throw new Error("post not found");
  }

  if (!isAdmin && confirmPost.authorId !== userId) {
    throw new Error("You can't edit another persons post!");
  }

  if (!isAdmin) {
    delete data.isFeatued;
  }

  return await prisma.post.update({
    where: {
      id: confirmPost.id,
    },
    data,
  });
};

const deletePost = async (userId: string, postId: string, isAdmin: boolean) => {
  const confirmPost = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!confirmPost) {
    throw new Error("post not found");
  }

  if (!isAdmin && confirmPost.authorId !== userId) {
    throw new Error("Only Admin and user can delete their own post!!");
  }

  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const statsCount = async () => {
  // const postsCount = await prisma.post.count();

  // const publishedCont = await prisma.post.count({
  //   where: { status: "Published" },
  // });

  // const draftCount = await prisma.post.count({ where: { status: "Draft" } });

  // const archivedCount = await prisma.post.count({
  //   where: { status: "Archived" },
  // });

  // const commentCount = await prisma.comment.count();

  // const rejectCommentCount = await prisma.comment.count({
  //   where: { status: "Reject" },
  // });

  // const approvedCommentCount = await prisma.comment.count({
  //   where: { status: "Approved" },
  // });

  const statCounts = await prisma.$transaction(async (tnx) => {
    const postsCount = await tnx.post.count();

    const publishedCont = await tnx.post.count({
      where: { status: "Published" },
    });

    const draftCount = await tnx.post.count({ where: { status: "Draft" } });

    const archivedCount = await tnx.post.count({
      where: { status: "Archived" },
    });

    const commentCount = await tnx.comment.count();

    const rejectCommentCount = await tnx.comment.count({
      where: { status: "Reject" },
    });

    const approvedCommentCount = await tnx.comment.count({
      where: { status: "Approved" },
    });

    return {
      postsCount,
      publishedCont,
      draftCount,
      archivedCount,
      commentCount,
      rejectCommentCount,
      approvedCommentCount,
    };
  });

  return statCounts;
};

export const postServices = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updateMyPost,
  deletePost,
  statsCount,
};

// test comment
// content = (1,2,3,4,5,6,7),   (8,9,10,11,12,13,14),  (15,16,17,18,19,20,21)
// page =           1,                    2,                      3
// limit = 7
// skip = (page-1) * limit
// another test comment
