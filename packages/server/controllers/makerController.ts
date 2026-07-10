import { Request, Response } from "express";
import Maker from "../models/Maker";

/**
 * @swagger
 * /api/makers:
 *   get:
 *     summary: Получить список всех издательств игр
 *     tags: [Makers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список издательств игр
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/Maker'}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getAllMakers = async (req: Request, res: Response) => {
  try {
    const makers = await Maker.findAll();
    res.json(makers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/makers:
 *   post:
 *     summary: Создать новое издательство игры
 *     tags: [Makers]
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
 *                 example: "Hobby World"
 *                 description: Название издательства
 *     responses:
 *       '201':
 *         description: Создатель успешно создан
 *         content:
 *           application/json:
 *             schema: {$ref: '#/components/schemas/Maker'}
 *
 *       '400': {description: Некорректные данные (отсутствует поле name)}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const postMaker = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Некорректные данные (отсутствует поле name)",
      });
    }

    const newMaker = await Maker.create({ name });
    res.status(201).json(newMaker);
  } catch (error) {
    console.error("Ошибка при создании создателя игры: ", error);
    res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: (error as Error).message,
    });
  }
};

/**
 * @swagger
 * /api/makers/{id}:
 *   delete:
 *     summary: Удалить издательство игр по ID
 *     tags: [Makers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: integer, example: 1}
 *     responses:
 *       '200':
 *         description: Создатель успешно удалён
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string}
 *       '400': {description: Некорректный ID}
 *       '404': {description: Издательство игры не найдено}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const deleteMaker = async (req: Request, res: Response) => {
  try {
    const makerId = parseInt(req.params.id as string, 10);

    if (!makerId || isNaN(makerId) || makerId <= 0) {
      return res.status(400).json({
        error: "Некорректный ID",
      });
    }

    const maker = await Maker.findByPk(makerId);
    if (!maker) {
      return res.status(404).json({
        error: "Издательство игры не найдено",
      });
    }

    await maker.destroy();
    res.status(200).json({
      message: "Создатель игры удалён успешно",
    });
  } catch (error) {
    console.error("Ошибка при удалении создателя игры:", error);
    res.status(500).json({
      error: "Внутренняя ошибка сервера",
      details: (error as Error).message,
    });
  }
};
