import express from "express";
import Comment from "../models/Comment";

const commentRouter = express.Router();

commentRouter.get("/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default commentRouter;
