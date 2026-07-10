import { Request as RequestExpress, Response } from "express";
import Library from "../models/Library";
import BoardGame from "../models/BoardGame";
import Genre from "../models/Genre";
import Maker from "../models/Maker";
import FavouriteGenre from "../models/FavouriteGenre";
import User from "../models/User";
import City from "../models/City";
import Request from "../models/Request";
import { sequelize } from "../db";

interface AuthRequest extends RequestExpress {
  user?: { userId: number };
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список всех пользователей (с количеством игр в библиотеке)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/UserWithGameCount'}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const users = await User.findAll({
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["password", "role"],
        include: [
          [
            sequelize.literal(`
              COALESCE(
                (
                  SELECT COUNT(*)
                  FROM libraries l
                  WHERE l.user_id = "User".id
                ),
                0
              )
            `),
            "game_count",
          ],
        ],
      },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
        {
          model: Library,
          as: "libraries",
          attributes: [],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/users/admin:
 *   get:
 *     summary: Получить список всех пользователей (для админа)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/User'}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getAllUsersAdmin = async (req: RequestExpress, res: Response) => {
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

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Получить пользователя по ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       '200':
 *         description: Пользователь найден
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/User'}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const id = parseInt(req.params.id as string, 10);

    const users = await User.findOne({
      where: { id: id },
      order: [["id", "DESC"]],
      attributes: {
        exclude: ["password", "role"],
      },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
        {
          model: Genre,
          as: "genres",
          through: { attributes: [] },
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

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Изменить роль пользователя
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           format: int32
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: {type: string, enum: [user, admin], example: admin}
 *     responses:
 *       '200':
 *         description: Роль успешно изменена
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/User'}
 *       '401': {description: Пользователь не авторизован}
 *       '404': {description: Пользователь с таким ID не найден}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const patchUserRole = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const { role } = req.body;
    const id = parseInt(req.params.id as string, 10);

    const user = await User.findByPk(id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Пользователь с таким ID не найден" });
    }

    await user.update({ role: role });
    return res.json(user);
  } catch (error) {
    console.error("Ошибка при изменении роли пользователя", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Обновить профиль текущего пользователя
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname: { type: string, minLength: 3 }
 *               email: { type: string, format: email }
 *               city_id: { type: integer, format: int32 }
 *               social_network: { type: string }
 *               is_show_city: { type: boolean }
 *     responses:
 *       '200':
 *         description: Профиль успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string }
 *                 user: {$ref: '#/components/schemas/User'}
 *       '401': {description: Пользователь не авторизован}
 *       '404': {description: Пользователь не найден}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const putUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;
    const newProfile = req.body.data;

    const [count] = await User.update(newProfile, {
      where: { id: currentUserId },
      returning: true,
    });

    if (count === 0) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    const userData = await User.findOne({
      where: { id: currentUserId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json({
      message: "Профиль успешно обновлен",
      user: userData,
    });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

//БИБЛИОТЕКА

/**
 * @swagger
 * /api/users/me/boardgames:
 *   get:
 *     summary: Получить библиотеку пользователя
 *     tags: ['Users: Library']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: query
 *         schema:
 *           type: integer
 *           example: 5
 *         description: ID пользователя. Если не указан, берется текущий пользователь.
 *     responses:
 *       '200':
 *         description: Список записей библиотеки с деталями игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/LibraryWithGameDetails'}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getLibrary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;
    const id = parseInt(req.params.id as string, 10);
    const userId = id ? id : currentUserId;

    const library = await Library.findAll({
      where: { user_id: userId },
      attributes: ["id", "rate"],
      include: [
        {
          model: BoardGame,
          as: "game",
          include: [
            {
              model: Genre,
              as: "genres",
              through: { attributes: [] },
              attributes: ["id", "name"],
              required: false,
            },
            {
              model: Maker,
              as: "maker",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    res.status(200).json(library);
  } catch (error) {
    console.error("Ошибка при получении библиотеки пользователя:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/users/me/boardgames/{game_id}:
 *   post:
 *     summary: Добавить игру в библиотеку пользователя
 *     tags: ['Users: Library']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 11
 *         description: ID настольной игры
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rate]
 *             properties:
 *               rate:
 *                 type: number
 *                 format: double
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *                 description: Оценка игры от 1 до 5 (включительно)
 *     responses:
 *       '201':
 *         description: Игра успешно добавлена в библиотеку
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/Library'}
 *       '400': {description: ID игры не указан}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const postGameToLibrary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;

    const gameId = parseInt(req.params.gameId as string, 10);

    if (!gameId) {
      return res.status(400).json({ error: "ID игры не указан" });
    }
    const { rate } = req.body;

    if (typeof rate !== "number" || rate < 1 || rate > 5) {
      return res
        .status(400)
        .json({ error: "Оценка должна быть числом от 1 до 5" });
    }
    const newFavouriteGame = await Library.create({
      user_id: currentUserId,
      game_id: gameId,
      rate: rate,
    });

    res.status(201).json(newFavouriteGame);
  } catch (error) {
    console.error("Ошибка при добавление настольной игры в библиотеку:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/users/me/boardgames/{game_id}:
 *   delete:
 *     summary: Удалить игру из библиотеки пользователя
 *     tags: ['Users: Library']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: gameId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 11
 *         description: ID настольной игры, которую нужно удалить из библиотеки
 *     responses:
 *       '200':
 *         description: Игра успешно удалена из библиотеки
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400': {description: ID игры не указан}
 *       '401': {description: Пользователь не авторизован}
 *       '404': {description: Игра в библиотеке не найден}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const deleteGameLibrary = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;

    const gameId = parseInt(req.params.gameId as string, 10);

    if (!gameId) {
      return res.status(400).json({ error: "ID игры не указан" });
    }

    const libraryGame = await Library.findOne({
      where: {
        user_id: currentUserId,
        game_id: gameId,
      },
    });

    if (!libraryGame) {
      return res.status(404).json({
        error: "Игра в библиотеке не найден",
      });
    }

    await libraryGame.destroy();
    res.status(200).json({
      message: "Игра удалена из библиотеки",
    });
  } catch (error) {
    console.error("Ошибка при удалении настольной игры из библиотеку:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

//ЛЮБИМЫЕ ЖАНРЫ ПОЛЬЗОВАТЕЛЯ

interface FavouriteGenreWithAssociation extends FavouriteGenre {
  genre: {
    id: number;
    name: string;
  } | null;
}

/**
 * @swagger
 * /api/users/me/genres:
 *   get:
 *     summary: Получить любимые жанры текущего пользователя
 *     tags: ['Users: FavouriteGenres']
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список любимых жанров пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/Genre'}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getUserGenres = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;

    const favourite = (await FavouriteGenre.findAll({
      where: { user_id: currentUserId },
      include: [
        {
          model: Genre,
          as: "genre",
          attributes: ["id", "name"],
        },
      ],
    })) as FavouriteGenreWithAssociation[];

    console.log(favourite);

    const genres = favourite.map((item) => item.genre);

    res.status(200).json(genres);
  } catch (error) {
    console.error("Ошибка при получении любимых жанров пользователя:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/users/me/genres:
 *   post:
 *     summary: Добавить жанр в любимые для текущего пользователя
 *     tags: ['Users: FavouriteGenres']
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                user_id: {type: integer, example: 10}
 *                genre_id: {type: integer, example: 5}
 *     responses:
 *       '201':
 *         description: Жанр успешно добавлен в любимые
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const postUserGenre = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;
    const { genreId } = req.body;

    const newFavouriteGenre = await FavouriteGenre.create({
      user_id: currentUserId,
      genre_id: genreId,
    });
    res.status(201).json(newFavouriteGenre);
  } catch (error) {
    console.error("Ошибка при добавлении жанра в любимые: ", error);
    res.status(500).json({
      error: "Не удалось добавить жанр в любимые",
      details: (error as Error).message,
    });
  }
};

/**
 * @swagger
 * /api/users/me/genres/{genreId}:
 *   delete:
 *     summary: Удалить жанр из любимых текущего пользователя
 *     tags: ['Users: FavouriteGenres']
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: genreId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           example: 5,
 *           description: ID жанра, который нужно удалить из любимых
 *     responses:
 *       '200':
 *         description: Жанр успешно удалён из любимых
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400': {description: Некорректный ID жанра}
 *       '401': {description: Пользователь не авторизован}
 *       '404': {description: Любимый жанр не найден}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const deleteUserGenre = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;
    const genreId = parseInt(req.params.genreId as string, 10);
    if (!genreId || isNaN(genreId) || genreId <= 0) {
      return res.status(400).json({
        error: "Некорректный ID жанра",
      });
    }

    const genre = await FavouriteGenre.findOne({
      where: {
        user_id: currentUserId,
        genre_id: genreId,
      },
    });

    if (!genre) {
      return res.status(404).json({
        error: "Любимый жанр не найден",
      });
    }

    await genre.destroy();
    res.status(200).json({
      message: "Любимый жанр удалён успешно",
    });
  } catch (error) {
    console.error("Ошибка при удалении любимого жанра:", error);
    res.status(500).json({
      error: "Не удалось удалить любимый жанр",
      details: (error as Error).message,
    });
  }
};

//ЗАПРОСЫ ПОЛЬЗОВАТЕЛЯ
/**
 * @swagger
 * /api/users/me/requests:
 *   post:
 *     summary: Создать новый запрос пользователя
 *     tags: ['Users: Request']
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Catan"
 *                 description: Заголовок/название запроса
 *               details:
 *                 type: ['string', 'null']
 *                 nullable: true
 *                 example: "Игра есть в моей коллекции..."
 *                 description: Подробное описание запроса
 *     responses:
 *       '201':
 *         description: Запрос успешно создан
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/Request'}
 *       '401': {description: Пользователь не авторизован}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const postUserRequest = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;
    const data = req.body;

    const request = await Request.create({
      name: data.name,
      is_done: false,
      user_id: currentUserId,
      details: data.details,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Ошибка при отправке запроса:", error);
    res.status(500).json({
      error: "Не удалось отправить запрос",
      details: (error as Error).message,
    });
  }
};
