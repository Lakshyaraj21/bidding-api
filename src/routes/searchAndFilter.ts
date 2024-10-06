import express from "express";
import { filterItemsByStatus, searchItems } from "../services/searchAndFilter";

const sfRouter = express.Router();

sfRouter.get("/search-items", searchItems);
sfRouter.get("/filter-items", filterItemsByStatus);

sfRouter.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "User Router Handler Error" });
});

export default sfRouter;
