import { Request, Response } from "express";
import Genre from "../models/Genre";

export const getAllGenre = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const postGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Поле 'name' обязательно для заполнения",
      });
    }

    const newGenre = await Genre.create({ name });
    res.status(201).json(newGenre);
  } catch (error) {
    console.error("Ошибка при создании жанра: ", error);
    res.status(500).json({
      error: "Не удалось создать жанр",
      details: (error as Error).message,
    });
  }
};

export const deleteGenre = async (req: Request, res: Response) => {
  try {
    const genreId = parseInt(req.params.id as string, 10);

    if (!genreId || isNaN(genreId) || genreId <= 0) {
      return res.status(400).json({
        error: "Некорректный ID жанра",
      });
    }

    const genre = await Genre.findByPk(genreId);
    if (!genre) {
      return res.status(404).json({
        error: "Жанр не найден",
      });
    }

    await genre.destroy();
    res.status(200).json({
      message: "Жанр удалён успешно",
    });
  } catch (error) {
    console.error("Ошибка при удалении жанра:", error);
    res.status(500).json({
      error: "Не удалось удалить жанр",
      details: (error as Error).message,
    });
  }
};
