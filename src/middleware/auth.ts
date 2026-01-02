import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";

export enum userRole {
  User = "USER",
  ADMIN = "ADMIN",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const authMiddle = (...roles: userRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized!",
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as string,
      emailVerified: session.user.emailVerified,
    };

    if (!roles.length && !roles.includes(req.user.role as userRole)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden Access!! You are not allowed to access this route",
      });
    }

    next();
  };
};

export default authMiddle;
