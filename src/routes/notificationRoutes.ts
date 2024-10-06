import express from "express";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../controllers/notificationController";

const notificationRouter = express.Router();

notificationRouter.get("/notifications", getNotifications);
notificationRouter.post("/notifications/mark-read", markNotificationsAsRead);

notificationRouter.use((err, req, res, next) => {
  console.log(err);
  res.json({ message: "Notification Router Handler Error" });
});

export default notificationRouter;
