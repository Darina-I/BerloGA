import express from "express";
import Maker from "../models/Maker";

const router = express.Router();

router.get("/makers", async (req, res) => {
  try {
    const makers = await Maker.findAll();
    res.json(makers);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
