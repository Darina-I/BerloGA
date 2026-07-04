import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import BoardGame from "../models/BoardGame";
import Maker from "../models/Maker";
import Genre from "../models/Genre";
import GenreGame from "../models/GenreGame";
import { sequelize } from "../db";
import Library from "../models/Library";
import { parseNumberArray } from "../utils/parseNumberArray";

interface BoardGameWithAssociations extends BoardGame {
  maker: {
    id: number;
    name: string;
  } | null;
  genres: Array<{
    name: string;
  }> | null;
  libraries?: Array<{
    id: number;
  }>;
}

interface GenreGameWithAssociations extends GenreGame {
  genre: Genre;
}

export const getAllBoardGames = async (req: Request, res: Response) => {
  try {
    const genresIds = parseNumberArray(req.query["genres[]"] as string[]) || [];

    const where: WhereOptions = {};
    if (genresIds.length > 0) {
      where["$genres.id$"] = { [Op.in]: genresIds };
    }

    const genresRequired = genresIds.length > 0;

    const boardgames = (await BoardGame.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`
              COALESCE(
                (
                  SELECT ROUND(AVG(l.rate))
                  FROM libraries l
                  WHERE l.game_id = "BoardGame".id
                ),
                0
              )
            `),
            "rating",
          ],
        ],
      },
      where,
      include: [
        {
          model: Maker,
          as: "maker",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          through: { attributes: [] },
          attributes: ["id", "name"],
          required: genresRequired,
        },
        {
          model: Library,
          as: "libraries",
          attributes: ["id"],
          required: false,
        },
      ],
    })) as BoardGameWithAssociations[];

    res.json(boardgames);
  } catch (error) {
    console.error("Ошибка при получении настольных игр:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBoardGameById = async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.id as string, 10);

    if (!gameId) {
      return res.status(400).json({ error: "ID игры не указан" });
    }

    const boardgame = (await BoardGame.findByPk(gameId, {
      attributes: {
        include: [
          [
            sequelize.literal(`
              COALESCE(
                (
                  SELECT ROUND(AVG(l.rate))
                  FROM libraries l
                  WHERE l.game_id = "BoardGame".id
                ),
                0
              )
            `),
            "rating",
          ],
        ],
      },
      include: [
        {
          model: Maker,
          as: "maker",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          through: { attributes: [] },
          attributes: ["id", "name"],
          required: false,
        },
        {
          model: Library,
          as: "libraries",
          attributes: ["id"],
          required: false,
        },
      ],
    })) as BoardGameWithAssociations;

    if (!boardgame) {
      return res.status(404).json({ error: "Игра не найдена" });
    }

    res.json(boardgame);
  } catch (error) {
    console.error("Ошибка при получении настольной игры по ID:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getGenresGame = async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.id as string, 10);

    if (!gameId) {
      return res.status(400).json({ error: "ID игры не указан" });
    }

    const genresgame = (await GenreGame.findAll({
      where: { game_id: gameId },
      include: [
        {
          model: Genre,
          as: "genre",
          attributes: ["id", "name"],
        },
      ],
    })) as GenreGameWithAssociations[];

    const genres = genresgame.map((gg) => gg.genre);
    res.status(200).json(genres);
  } catch (error) {
    console.error("Ошибка при получении жанров игры:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};
