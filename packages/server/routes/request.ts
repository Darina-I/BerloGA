import express from "express";
import Request from "../models/Request";
import Subscription from "../models/Subscription";

const requestRouter = express.Router();

requestRouter.get("/requests", async (req, res) => {
  try {
    const requests = await Request.findAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default requestRouter;
