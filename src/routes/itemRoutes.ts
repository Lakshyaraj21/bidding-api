import express from "express";
import {
  createItem,
  deleteItem,
  getAllItems,
  getItemById,
  getItemsByUser,
  updateItem,
} from "../controllers/itemController";
import { upload } from "../utils/multerClient";

const itemsRouter = express.Router();

itemsRouter.get("/items", getAllItems);
itemsRouter.get("/items/user", getItemsByUser);
itemsRouter.get("/items/:id", getItemById);
itemsRouter.post("/items", upload.single("image"), createItem);
itemsRouter.put("/items/:id", upload.single("image"), updateItem);
itemsRouter.delete("/items/:id", deleteItem);

itemsRouter.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "Item Router Handler Error" });
});

export default itemsRouter;
