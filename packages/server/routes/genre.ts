import express from "express";
import {
  deleteGenre,
  getAllGenre,
  postGenre,
} from "../controllers/genreController";

const genreRouter = express.Router();

genreRouter
  .route("/genres")
  .get(getAllGenre)
  .post(postGenre)
  .delete(deleteGenre);

export default genreRouter;
