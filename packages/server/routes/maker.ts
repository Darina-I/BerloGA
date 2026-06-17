import express from "express";
import Maker from "../models/Maker";

const makerRouter = express.Router();

makerRouter.get("/makers", async (req, res) => {
  try {
    const makers = await Maker.findAll();
    res.json(makers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default makerRouter;
