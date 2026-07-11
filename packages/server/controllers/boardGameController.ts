import { Request, Response } from "express";
import { Op, WhereOptions } from "sequelize";
import BoardGame from "../models/BoardGame";
import Maker from "../models/Maker";
import Genre from "../models/Genre";
import GenreGame from "../models/GenreGame";
import { sequelize } from "../db";
import Library from "../models/Library";
import { parseNumberArray } from "../utils/parseNumberArray";
import FavouriteGenre from "../models/FavouriteGenre";

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

interface AuthRequest extends Request {
  user?: { userId: number };
}

/**
 * @swagger
 * /api/boardgames:
 *   get:
 *     summary: Получить список настольных игр (с фильтрацией по жанрам)
 *     tags: [BoardGames]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: genres[]
 *         in: query
 *         required: false
 *         schema:
 *           type: array
 *           items: {type: integer, example: [1, 3]}
 *           description: Массив ID жанров для фильтрации
 *     responses:
 *       '200':
 *         description: Список игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BoardGame'
 *       '500':
 *          description: Внутренняя ошибка сервера
 */
export const getAllBoardGames = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;

    const genresIds = parseNumberArray(req.query["genres[]"] as string[]) || [];
    const where: WhereOptions = {};
    if (genresIds.length > 0) {
      where["$genres.id$"] = { [Op.in]: genresIds };
    }
    const genresRequired = genresIds.length > 0;

    const favouriteGenres = await FavouriteGenre.findAll({
      where: { user_id: currentUserId },
    });

    const favouriteGenresId = favouriteGenres.map((fg) => fg.genre_id);

    let order: any[] = [];

    if (favouriteGenresId.length > 0) {
      order = [
        [
          sequelize.literal(`
            CASE
              WHEN "BoardGame"."id" IN (
                SELECT "game_id" FROM "genregames"
                WHERE "genre_id" IN (${favouriteGenresId.join(", ")})
              )
              THEN 0
              ELSE 1
            END
          `),
          "ASC",
        ],
        ...order,
      ];
    }

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
      order,
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

/**
 * @swagger
 * /api/boardgames/{id}:
 *   get:
 *     summary: Получить настольную игру по ID
 *     tags: [BoardGames]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: {type: integer, example: 7}
 *         description: ID игры
 *     responses:
 *       '200':
 *         description: Данные игры
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardGame'
 *       '400':
 *         description: ID игры не указан
 *       '404':
 *         description: Игра не найдена
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
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

/**
 * @swagger
 * /api/boardgames:
 *   post:
 *     summary: Создать новую настольную игру
 *     tags: [BoardGames]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - maker_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Catan'
 *                 description: Название игры
 *               description:
 *                 type: string,
 *                 nullable: true,
 *                 example: 'Колонизаторы'
 *               maker_id:
 *                 type: integer
 *                 example: 3
 *                 description: ID производителя
 *               min_players:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *               max_players:
 *                 type: integer
 *                 nullable: true
 *                 example: 4
 *               time:
 *                 type: integer
 *                 nullable: true
 *                 example: 120
 *     responses:
 *       '201':
 *         description: Игра успешно создана
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BoardGame'
 *       '500':
 *         description: Внутренняя ошибка сервера
 */

export const postBoardGame = async (req: Request, res: Response) => {
  try {
    const newGame = req.body;

    const newBoardGame = await BoardGame.create(newGame);

    res.status(201).json(newBoardGame);
  } catch (error) {
    console.error("Ошибка при добавление настольной игры:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/boardgames/{id}/genres:
 *   get:
 *     summary: Получить жанры настольной игры
 *     tags: ["BoardGames: Genres"]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID игры
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       '200':
 *         description: Список жанров игры
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       '400':
 *         description: ID игры не указан
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
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

/**
 * @swagger
 * /api/boardgames/{id}/genres:
 *   post:
 *     summary: Добавить жанр к настольной игре
 *     tags: ['BoardGames: Genres']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID игры
 *         schema:
 *           type: integer
 *           example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - genreId
 *             properties:
 *               genreId:
 *                 type: integer
 *                 example: 5
 *                 description: ID жанра, который нужно добавить к игре
 *     responses:
 *       '200':
 *         description: Жанр успешно добавлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Жанр успешно добавлен к игре"
 *       '400':
 *         description: Некорректные ID
 *       '404':
 *         description: Игра или жанр не найдены
 *       '409':
 *         description: Этот жанр уже добавлен к игре
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
export const postGenreGame = async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.id as string, 10);
    const { genreId } = req.body;

    if (isNaN(gameId) || isNaN(genreId)) {
      return res.status(400).json({ error: "Некорректные ID" });
    }

    const [game, genre] = await Promise.all([
      BoardGame.findByPk(gameId),
      Genre.findByPk(genreId),
    ]);

    if (!game) {
      return res.status(404).json({ error: "Игра не найдена" });
    }
    if (!genre) {
      return res.status(404).json({ error: "Жанр не найден" });
    }

    const existing = await GenreGame.findOne({
      where: {
        game_id: gameId,
        genre_id: genreId,
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Этот жанр уже добавлен к игре" });
    }

    await GenreGame.create({
      game_id: gameId,
      genre_id: genreId,
    });

    return res.json({ success: true, message: "Жанр успешно добавлен к игре" });
  } catch (error) {
    console.error("Ошибка при добавлении жанра:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/boardgames/{id}/genres/{genreId}:
 *   delete:
 *     summary: Удалить связь жанра с настольной игрой
 *     tags: ['BoardGames: Genres']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *            type: integer,
 *            example: 7,
 *            description: ID настольной игры
 *       - name: genreId
 *         in: path
 *         required: true
 *         schema:
 *            type: integer,
 *            example: 5,
 *            description: ID жанра, который нужно отвязать от игры
 *     responses:
 *       '200':
 *         description: Связь успешно удалена
 *         content:
 *           application/json:
 *             type: object
 *             properties:
 *               success:
 *                  type: boolean,
 *                  example: true
 *               message:
 *                  type: string,
 *                  example: 'Жанр удалён из игры'
 *       '400':
 *          description: Некорректные ID
 *       '404':
 *          description: Связь жанр-игра не найдена!
 *       '500':
 *          description: Внутренняя ошибка сервера
 */
export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const gameId = parseInt(req.params.id as string, 10);
    const genreId = parseInt(req.params.genreId as string, 10);

    if (isNaN(gameId) || isNaN(genreId)) {
      return res.status(400).json({ error: "Некорректные ID" });
    }

    const genregame = await GenreGame.findOne({
      where: {
        game_id: gameId,
        genre_id: genreId,
      },
    });

    if (!genregame) {
      return res.status(404).json({ error: "Связь жанр-игра не найдена!" });
    }

    await genregame.destroy();
    return res.json({ success: true, message: "Жанр удалён из игры" });
  } catch (error) {
    console.error("Ошибка при удалении жанра:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
};
