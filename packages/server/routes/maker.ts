import express from "express";
import {
  deleteMaker,
  getAllMakers,
  postMaker,
} from "../controllers/makerController";
import { authMiddleware } from "../middleware/guard";

const makerRouter = express.Router();

makerRouter.use(authMiddleware); //только для авторизованных пользователей

makerRouter.route("/").get(getAllMakers).post(postMaker);
makerRouter.route("/:id").delete(deleteMaker);

export default makerRouter;
