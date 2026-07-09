import express from "express";
import {
  deleteGenre,
  getAllBoardGames,
  getBoardGameById,
  getGenresGame,
  postBoardGame,
  postGenreGame,
} from "../controllers/boardGameController";
import { authMiddleware } from "../middleware/guard";
import { checkAdmin } from "../middleware/checkAdmin";
import { getComments, postBlock } from "../controllers/commentBlockController";

const boardgameRouter = express.Router();

boardgameRouter.use(authMiddleware); //только для авторизованных пользователей

boardgameRouter.route("/").get(getAllBoardGames).post(postBoardGame);
boardgameRouter.route("/:id").get(getBoardGameById);
boardgameRouter.route("/:id/genres").get(getGenresGame);

boardgameRouter.route("/").post(checkAdmin, postBoardGame);
boardgameRouter.route("/:id/genres").post(checkAdmin, postGenreGame);
boardgameRouter.route("/:id/genres/:genreId").delete(checkAdmin, deleteGenre);

boardgameRouter.route("/:id/comments-blocks").get(getComments).post(postBlock);

export default boardgameRouter;
