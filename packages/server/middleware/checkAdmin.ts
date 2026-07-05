import { NextFunction, Request, Response } from "express";

export const checkAdmin = (
  req: Request & { user?: { userId: number; role: "admin" | "user" } },
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Доступ разрешен только администраторам" });
  }

  next();
};
