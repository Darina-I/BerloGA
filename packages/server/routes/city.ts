import express from "express";
import City from "../models/City";

const cityRouter = express.Router();

cityRouter.get("/cities", async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default cityRouter;
