import express from "express";
import Complaint from "../models/Complaint";

const complaintRouter = express.Router();

complaintRouter.get("/complaint", async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default complaintRouter;
