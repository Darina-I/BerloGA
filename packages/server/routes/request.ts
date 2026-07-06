import express from "express";
import { authMiddleware } from "../middleware/guard";
import { checkAdmin } from "../middleware/checkAdmin";
import { getAllRequests, patchRequest } from "../controllers/requestController";

const requestRouter = express.Router();

requestRouter.use(authMiddleware);
requestRouter.use(checkAdmin);

requestRouter.route("/").get(getAllRequests);
requestRouter.route("/:id").patch(patchRequest);

export default requestRouter;
