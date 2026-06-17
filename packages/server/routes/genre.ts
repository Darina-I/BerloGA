import express from "express";
import Genre from "../models/Genre";

const genreRouter = express.Router();

genreRouter.get("/genres", async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default genreRouter;
