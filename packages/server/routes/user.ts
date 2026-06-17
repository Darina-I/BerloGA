import express from "express";
import User from "../models/User";
import FavouriteGenre from "../models/FavouriteGenre";
import Library from "../models/Library";

const userRouter = express.Router();

userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default userRouter;
