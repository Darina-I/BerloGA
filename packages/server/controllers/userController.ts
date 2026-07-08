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

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    const currentUserId = req.user.userId;

    const user = await User.findOne({
      where: { id: currentUserId },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        error: "Пользователь не найден",
      });
    }

    res.status(200).json({
      message: "Пользователь найден",
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user?.email,
        city: user?.city,
        social_network: user?.social_network,
        is_show_city: user.is_show_city,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Ошибка при получении пользователя", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

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
