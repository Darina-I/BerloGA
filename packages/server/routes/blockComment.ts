import express from "express";
import BlockComment from "../models/BlockComment";

const blockCommentRouter = express.Router();

blockCommentRouter.get("/comment-threads", async (req, res) => {
  try {
    const blocksComments = await BlockComment.findAll();
    res.json(blocksComments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default blockCommentRouter;
