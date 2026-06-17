import express from "express";
import BoardGame from "../models/BoardGame";

const boardgameRouter = express.Router();

boardgameRouter.get("/boardgames", async (req, res) => {
  try {
    const boardgames = await BoardGame.findAll();
    res.json(boardgames);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default boardgameRouter;
