import express from "express";
import {
  getAllBoardGames,
  getBoardGameById,
  getGenresGame,
} from "../controllers/boardGameController";
import { authMiddleware } from "../middleware/guard";

const boardgameRouter = express.Router();

boardgameRouter.use(authMiddleware); //только для авторизованных пользователей

boardgameRouter.route("/").get(getAllBoardGames);
boardgameRouter.route("/:id").get(getBoardGameById);
boardgameRouter.route("/:id/genres").get(getGenresGame);

export default boardgameRouter;
