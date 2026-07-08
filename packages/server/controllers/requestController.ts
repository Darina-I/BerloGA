import { Request as ExpressRequest, Response } from "express";
import Request from "../models/Request";
import User from "../models/User";

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
