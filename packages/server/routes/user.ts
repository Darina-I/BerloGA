import express from "express";
import {
  deleteGameLibrary,
  deleteUserGenre,
  getAllUsers,
  getLibrary,
  getUserGenres,
  patchUserRole,
  postGameToLibrary,
  postUserGenre,
  postUserRequest,
  putUser,
} from "../controllers/userController";
import { authMiddleware } from "../middleware/guard";
import { checkAdmin } from "../middleware/checkAdmin";

const userRouter = express.Router();

userRouter.use(authMiddleware); //только для авторизованных пользователей

userRouter.route("/").get(checkAdmin, getAllUsers);
userRouter.route("/:id").patch(checkAdmin, patchUserRole);

userRouter.route("/me").put(putUser);

userRouter.route("/me/boardgames").get(getLibrary);
userRouter
  .route("/me/boardgames/:gameId")
  .post(postGameToLibrary)
  .delete(deleteGameLibrary);

userRouter.route("/me/genres").get(getUserGenres).post(postUserGenre);
userRouter.route("/me/genres/:genreId").delete(deleteUserGenre);

userRouter.route("/me/requests").post(postUserRequest);

export default userRouter;
