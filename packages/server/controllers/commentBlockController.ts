import { Request, Response } from "express";
import BlockComment from "../models/BlockComment";
import Comment from "../models/Comment";
import User from "../models/User";

interface AuthRequest extends Request {
  user?: { userId: number };
}

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const userId = req.user.userId;
    const gameId = parseInt(req.params.id as string, 10);

    const comments = await BlockComment.findAll({
      where: { game_id: gameId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "nickname"],
        },
        {
          model: Comment,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (error) {
    console.error("Ошибка при получении комментариев", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const postBlock = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const userId = req.user.userId;
    const gameId = parseInt(req.params.id as string, 10);
    const { header } = req.body;

    const block = await BlockComment.create({
      author_id: userId,
      game_id: gameId,
      header: header,
    });

    res.status(201).json(block);
  } catch (error) {
    console.error("Ошибка при создании блока комментариев", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const postComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const userId = req.user.userId;
    const blockId = parseInt(req.params.id as string, 10);
    const { content } = req.body;

    const comment = Comment.create({
      blockComment_id: blockId,
      user_id: userId,
      content: content,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Ошибка при создании комментария", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
