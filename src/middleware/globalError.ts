import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let errStatus = 500;
  let errorMessage = "Internal Server Error!";
  let errorDetails = err;

  if (err instanceof Prisma.PrismaClientValidationError) {
    errStatus = 400;
    errorMessage = "You inputed wring type data or wrong info";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if ((err.code = "P2001")) {
      errStatus = 400;
      errorMessage = `Unique constraint failed`;
    } else if ((err.code = "P2003")) {
      errStatus = 400;
      errorMessage = "Foreign key constraint failed";
    } else if ((err.code = "P2025")) {
      errStatus = 400;
      errorMessage =
        "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    errStatus = 500;
    errorMessage = "unknown error";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if ((err.errorCode = "P1001")) {
      errStatus = 401;
      errorMessage =
        "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.";
    }
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    errStatus = 1001;
    errorMessage =
      "Can't reach database server at {database_host}:{database_port} Please make sure your database server is running at {database_host}:{database_port}.";
  }

  res.status(errStatus);
  res.json({
    message: errorMessage,
    error: errorDetails,
  });
}

export default errorHandler;
