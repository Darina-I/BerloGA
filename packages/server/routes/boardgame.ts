import express from "express";
import {
  getAllBoardGames,
  getBoardGameById,
  getGenresGame,
} from "../controllers/boardGameController";

const boardgameRouter = express.Router();

boardgameRouter.route("/boardgames").get(getAllBoardGames);
boardgameRouter.route("/boardgames/:id").get(getBoardGameById);
boardgameRouter.route("/boardgames/:id/genres").get(getGenresGame);

export default boardgameRouter;
