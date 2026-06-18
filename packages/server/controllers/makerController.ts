import { Request, Response } from "express";
import Maker from "../models/Maker";

export const getAllMakers = async (req: Request, res: Response) => {
  try {
    const makers = await Maker.findAll();
    res.json(makers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const postMaker = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        error: "Поле 'name' обязательно для заполнения",
      });
    }

    const newMaker = await Maker.create({ name });
    res.status(201).json(newMaker);
  } catch (error) {
    console.error("Ошибка при создании создателя игры: ", error);
    res.status(500).json({
      error: "Не удалось создать создателя игры",
      details: (error as Error).message,
    });
  }
};

export const deleteMaker = async (req: Request, res: Response) => {
  try {
    const makerId = parseInt(req.params.id as string, 10);

    if (!makerId || isNaN(makerId) || makerId <= 0) {
      return res.status(400).json({
        error: "Некорректный ID жанра",
      });
    }

    const maker = await Maker.findByPk(makerId);
    if (!maker) {
      return res.status(404).json({
        error: "Создатель игры не найден",
      });
    }

    await maker.destroy();
    res.status(200).json({
      message: "Создатель игры удалён успешно",
    });
  } catch (error) {
    console.error("Ошибка при удалении создателя игры:", error);
    res.status(500).json({
      error: "Не удалось удалить создателя игры",
      details: (error as Error).message,
    });
  }
};
