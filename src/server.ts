import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { protect } from "./middlewares/authMiddleware";
import validate from "./middlewares/validateMiddleware";
import { BaseUserSchema, LoginUserSchema } from "./validators/user";
import userRouter from "./routes/userRoutes";
import {
  loginUser,
  registerUser,
  resetUserPassword,
  verifyOTPAndResetPassword,
} from "./controllers/userController";
import itemsRouter from "./routes/itemRoutes";
import bidRouter from "./routes/bidRoutes";
import notificationRouter from "./routes/notificationRoutes";
import xss from "./middlewares/xss";
import { rateLimiter } from "./middlewares/rateLimiter";
import path from "path";
import { errorLoggerMiddleware, loggerMiddleware } from "./services/logging";
import sfRouter from "./routes/searchAndFilter";

const app = express();
app.use(loggerMiddleware);
app.use(cors());
app.use("/static", express.static(path.join(__dirname, "../uploads")));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(rateLimiter);

app.get("/", (req: Request, res: Response) => {
  console.log("Hello from Bidding Platform!");
  res.status(200).json({ message: "Hello from Bidding Platform" });
});

app.use("/api", protect);

app.post("/users/register", validate(BaseUserSchema), registerUser);
app.post("/users/login", validate(LoginUserSchema), loginUser);
app.post("/users/send-otp", resetUserPassword);
app.post("/users/reset-password", verifyOTPAndResetPassword);

app.use("/api/users", userRouter);
app.use("/api", itemsRouter);
app.use("/api", bidRouter);
app.use("/api", notificationRouter);
app.use("/api", sfRouter);

app.use(errorLoggerMiddleware);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ error: err });
});

export default app;
