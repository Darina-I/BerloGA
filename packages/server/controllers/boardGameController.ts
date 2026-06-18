import { Request, Response } from "express";
import BoardGame from "../models/BoardGame";
import Maker from "../models/Maker";
import Genre from "../models/Genre";
import GenreGame from "../models/GenreGame";

interface BoardGameWithAssociations extends BoardGame {
  maker: {
    id: number;
    name: string;
  } | null;
  genresgame: Array<{
    genre: {
      name: string;
    };
  }> | null;
}

interface GenreGameWithAssociations extends GenreGame {
  genre: Genre;
}

export const getAllBoardGames = async (req: Request, res: Response) => {
  try {
    const boardgames = (await BoardGame.findAll({
      include: [
        {
          model: Maker,
          as: "maker",
          attributes: ["id", "name"],
        },
        {
          model: GenreGame,
          as: "genresgame",
          attributes: ["id"],
          include: [
            {
              model: Genre,
              as: "genre",
              attributes: ["name"],
            },
          ],
        },
      ],
    })) as BoardGameWithAssociations[];

    const formattedGames = boardgames.map((game) => {
      return {
        ...game.get({ plain: true }),
        maker: game.maker ? { id: game.maker.id, name: game.maker.name } : null,
        genres: game.genresgame?.map((gg) => gg.genre.name) || [],
      };
    });

    res.json(formattedGames);
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
      include: [
        {
          model: Maker,
          as: "maker",
          attributes: ["id", "name"],
        },
        {
          model: GenreGame,
          as: "genresgame",
          attributes: ["id"],
          include: [
            {
              model: Genre,
              as: "genre",
              attributes: ["name"],
            },
          ],
        },
      ],
    })) as BoardGameWithAssociations;

    if (!boardgame) {
      return res.status(404).json({ error: "Игра не найдена" });
    }

    const formattedGame = {
      ...boardgame.get({ plain: true }),
      maker: boardgame.maker
        ? { id: boardgame.maker.id, name: boardgame.maker.name }
        : null,
      genres: boardgame.genresgame?.map((gg) => gg.genre.name) || [],
    };

    res.json(formattedGame);
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
