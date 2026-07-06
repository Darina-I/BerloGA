import express from "express";
import {
  getAllBoardGames,
  getBoardGameById,
  getGenresGame,
  postBoardGame,
} from "../controllers/boardGameController";
import { authMiddleware } from "../middleware/guard";
import { checkAdmin } from "../middleware/checkAdmin";

const boardgameRouter = express.Router();

boardgameRouter.use(authMiddleware); //только для авторизованных пользователей

boardgameRouter.route("/").get(getAllBoardGames).post(postBoardGame);
boardgameRouter.route("/:id").get(getBoardGameById);
boardgameRouter.route("/:id/genres").get(getGenresGame);

boardgameRouter.route("/").post(checkAdmin, postBoardGame);

export default boardgameRouter;
