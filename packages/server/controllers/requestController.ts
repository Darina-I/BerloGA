import { Request as ExpressRequest, Response } from "express";
import Request from "../models/Request";
import User from "../models/User";

/**
 * @swagger
 * /api/requests:
 *   get:
 *     summary: Получить все запросы
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список запросов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/Request'}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const getAllRequests = async (req: ExpressRequest, res: Response) => {
  try {
    const requests = await Request.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nickname"],
        },
      ],
      order: [
        ["is_done", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
    res.json(requests);
  } catch (error) {
    console.error("Ошибка при получении заявок:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

/**
 * @swagger
 * /api/requests/{id}:
 *   patch:
 *     summary: Обновить статус запроса
 *     tags: [Requests]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: {type: integer, example: 7}
 *         description: ID запроса для обновления
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: boolean
 *                 example: true
 *                 description: Новое значение статуса is_done
 *     responses:
 *       '200':
 *         description: Запрос успешно обновлён
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       '400': {description: ID запроса или статус не указаны}
 *       '404': {description: Запрос с таким ID не найден}
 *       '500': {description: Внутренняя ошибка сервера}
 */
export const patchRequest = async (req: ExpressRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID запроса не указан" });
    }

    if (typeof status !== "boolean") {
      return res
        .status(400)
        .json({ error: "Поле 'status' обязательно и должно быть булевым" });
    }

    const request = await Request.findByPk(id);
    if (!request) {
      return res.status(404).json({ error: "Запрос с таким ID не найден" });
    }

    await request.update({ is_done: status });
    return res.json(request);
  } catch (error) {
    console.error("Ошибка при обновлении запроса:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
};
