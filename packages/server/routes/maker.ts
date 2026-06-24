import express from "express";
import {
  deleteMaker,
  getAllMakers,
  postMaker,
} from "../controllers/makerController";
import { authMiddleware } from "../middleware/guard";

const makerRouter = express.Router();

makerRouter.use(authMiddleware); //только для авторизованных пользователей

makerRouter
  .route("/maker")
  .get(getAllMakers)
  .post(postMaker)
  .delete(deleteMaker);

export default makerRouter;
