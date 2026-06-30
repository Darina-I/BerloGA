import express from "express";
import {
  deleteUserGenre,
  getLibrary,
  getUserGenres,
  postUserGenre,
  putUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/guard";

const userRouter = express.Router();

userRouter.use(authMiddleware); //только для авторизованных пользователей

userRouter.route("/me").put(putUser);

userRouter.route("/me/boardgames").get(getLibrary);

userRouter.route("/me/genres").get(getUserGenres).post(postUserGenre);
userRouter.route("/me/genres/:genreId").delete(deleteUserGenre);

export default userRouter;
