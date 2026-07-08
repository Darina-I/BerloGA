import { Request, Response } from "express";
import BoardGame from "../models/BoardGame";
import Genre from "../models/Genre";
import { sequelize } from "../db";
import Library from "../models/Library";
import City from "../models/City";
import User from "../models/User";

interface CountGamesResponse extends Genre {
  game_count: string;
}

export const getCountGamesByGenres = async (req: Request, res: Response) => {
  try {
    const countGames = (await Genre.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("games.id")), "game_count"],
      ],
      include: [
        {
          model: BoardGame,
          as: "games",
          through: { attributes: [] },
          required: false,
          attributes: [],
        },
      ],
      group: ['"Genre"."id"', '"Genre"."name"'],
      order: [[sequelize.col("game_count"), "DESC"]],
    })) as CountGamesResponse[];

    const result = countGames.map((g) => ({
      id: g.id,
      name: g.name,
      game_count: Number(g.get("game_count")),
    }));

    res.json(result);
  } catch (error) {
    console.log("Ошибка при получении статистики по жанрам:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTopGames = async (req: Request, res: Response) => {
  try {
    const topByLibrary = await BoardGame.findAll({
      attributes: [
        "id",
        "name",
        [
          sequelize.literal(`
            COALESCE(
              (
                SELECT ROUND(AVG(l.rate), 1)
                FROM libraries l
                WHERE l.game_id = "BoardGame".id
              ),
              0
            )
          `),
          "rating",
        ],
        [
          sequelize.literal(`
            COALESCE(
              (
                SELECT COUNT(*)
                FROM libraries l
                WHERE l.game_id = "BoardGame".id
              ),
              0
            )
          `),
          "library_count",
        ],
      ],
      include: [
        {
          model: Library,
          as: "libraries",
          attributes: [],
          required: false,
        },
      ],
      group: ['"BoardGame"."id"', '"BoardGame"."name"'],
      order: [[sequelize.col("library_count"), "DESC"]],
      limit: 10,
    });

    const topByRating = await BoardGame.findAll({
      attributes: [
        "id",
        "name",
        // Считаем средний рейтинг из library (подзапрос)
        [
          sequelize.literal(`
            COALESCE(
              (
                SELECT ROUND(AVG(l.rate), 1)
                FROM libraries l
                WHERE l.game_id = "BoardGame".id
              ),
              0
            )
          `),
          "rating",
        ],
        // Количество добавлений в библиотеку (подзапрос)
        [
          sequelize.literal(`
            COALESCE(
              (
                SELECT COUNT(*)
                FROM libraries l
                WHERE l.game_id = "BoardGame".id
              ),
              0
            )
          `),
          "library_count",
        ],
      ],
      include: [
        {
          model: Library,
          as: "libraries",
          attributes: [],
          required: false,
        },
      ],
      order: [[sequelize.col("rating"), "DESC"]],
      limit: 10,
    });

    res.json({
      topByLibrary,
      topByRating,
    });
  } catch (error) {
    console.log("Ошибка при получении статистики по настольным играм:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      order: [["id", "DESC"]],
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
