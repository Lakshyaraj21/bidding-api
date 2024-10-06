import express from "express";
import { getUserProfile } from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/profile", getUserProfile);

userRouter.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "User Router Handler Error" });
});

export default userRouter;
