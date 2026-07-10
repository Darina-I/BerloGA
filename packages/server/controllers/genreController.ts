import { Request, Response } from "express";
import Genre from "../models/Genre";

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Получить список всех жанров
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список жанров игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       '500':
 *         description: Внутренняя ошибка сервера
 */
export const getAllGenre = async (req: Request, res: Response) => {
  try {
    const genres = await Genre.findAll();
    res.status(200).json(genres);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Добавить новый жанр игры
 *     tags: [Genres]
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
 *               name: {type: string, example: "Стратегия", description: Название жанра}
 *     responses:
 *       '201':
 *         description: Создатель успешно создан
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/Genre'}
 *       '400': {description: Некорректные данные (отсутствует поле name)}
 *       '500': {description: Внутренняя ошибка сервера}
 *
 */
export const postGenre = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Некорректные данные (отсутствует поле name)",
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

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Удалить жанр игр по ID
 *     tags: [Genres]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: {type: integer, example: 1}
 *     responses:
 *       '200':
 *         description: Жанр игры успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: {type: string}
 *       '400': {description: Некорректный ID жанра}
 *       '404': {description: Жанр игры не найдено}
 *       '500': {description: Внутренняя ошибка сервера}
 */
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
