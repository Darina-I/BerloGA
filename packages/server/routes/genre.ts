import express from "express";
import {
  deleteGenre,
  getAllGenre,
  postGenre,
} from "../controllers/genreController";
import { authMiddleware } from "../middleware/guard";

const genreRouter = express.Router();

genreRouter.use(authMiddleware); //только для авторизованных пользователей

genreRouter.route("/").get(getAllGenre).post(postGenre).delete(deleteGenre);

export default genreRouter;
