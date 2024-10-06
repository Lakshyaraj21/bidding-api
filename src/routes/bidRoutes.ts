import express from "express";
import {
  getAllItemBids,
  createBidOnItemWithOutbidNotification,
} from "../controllers/bidController";

const bidRouter = express.Router();

bidRouter.get("/items/:id/bids", getAllItemBids);
// bidRouter.post("/items/:id/bids", createBidOnItem);
// bidRouter.post("/items/:id/bids", createBidOnItemWithNotification);
bidRouter.post("/items/:id/bids", createBidOnItemWithOutbidNotification);

bidRouter.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "bid Router Handler Error" });
});

export default bidRouter;
