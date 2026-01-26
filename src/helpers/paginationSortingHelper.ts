type IOptions = {
  pageNumber?: number | string;
  limitNumber?: number | string;
  sortBy?: string | undefined;
  sortOrder?: "asc" | "desc" | undefined;
};

type IOptionsResult = {
  pageNumber: number;
  limitNumber: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const pageNumber: number = Number(options.pageNumber) || 1;

  const limitNumber: number = Number(options.limitNumber) || 20;

  const skip: number = (pageNumber - 1) * limitNumber;

  const sortBy: string = options.sortBy || "createdAt";

  const sortOrder: "asc" | "desc" | undefined =
    options.sortOrder === "asc" || options.sortOrder === "desc"
      ? (options.sortOrder as "asc" | "desc")
      : "desc";

  return {
    pageNumber,
    limitNumber,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
