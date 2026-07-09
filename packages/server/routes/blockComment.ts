import express from "express";
import { postComment } from "../controllers/commentBlockController";
import { authMiddleware } from "../middleware/guard";

const blockCommentRouter = express.Router();

blockCommentRouter.use(authMiddleware);

blockCommentRouter.route("/:id").post(postComment);

export default blockCommentRouter;
