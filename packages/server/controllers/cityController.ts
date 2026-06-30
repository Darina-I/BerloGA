import { Request, Response } from "express";
import City from "../models/City";

export const getAllCities = async (req: Request, res: Response) => {
  try {
    const cities = await City.findAll();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
