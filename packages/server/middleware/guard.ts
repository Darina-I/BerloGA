import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";

export const authMiddleware = (
  req: Request & { user?: { userId: number } },
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Требуется заголовок авторизации" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = verifyAccessToken(token);
    req.user = { userId: user.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: (error as Error).message });
  }
};
