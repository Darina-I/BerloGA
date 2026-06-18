import express from "express";
import {
  deleteMaker,
  getAllMakers,
  postMaker,
} from "../controllers/makerController";

const makerRouter = express.Router();

makerRouter
  .route("/maker")
  .get(getAllMakers)
  .post(postMaker)
  .delete(deleteMaker);

export default makerRouter;
