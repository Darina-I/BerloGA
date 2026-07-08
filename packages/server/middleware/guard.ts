import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";

export const authMiddleware = (
  req: Request & { user?: { userId: number; role: "admin" | "user" } },
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Требуется авторизация" });
    }

    const user = verifyAccessToken(token);
    req.user = { userId: user.userId, role: user.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Недействительный токен" });
  }
};
