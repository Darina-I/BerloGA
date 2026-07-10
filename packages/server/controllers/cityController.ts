import { Request, Response } from "express";
import City from "../models/City";

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Получить список всех городов
 *     tags: [City]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Список городов
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: {$ref: '#/components/schemas/City'}
 *       '500': {description: Внутренняя ошибка сервера}
 *
 */
export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.findAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
