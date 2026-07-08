import express from "express";
import { authMiddleware } from "../middleware/guard";
import {
  getCountGamesByGenres,
  getTopGames,
} from "../controllers/adminController";
import { checkAdmin } from "../middleware/checkAdmin";

const adminRouter = express.Router();

adminRouter.use(authMiddleware); //только для авторизованных пользователей
adminRouter.use(checkAdmin);

adminRouter.route("/countgames").get(getCountGamesByGenres);
adminRouter.route("/topgames").get(getTopGames);

export default adminRouter;
