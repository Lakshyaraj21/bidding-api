import { Request, Response, NextFunction } from "express";
import { UserPayload } from "./authMiddleware";

export const roleMiddleware = (role?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserPayload;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (role && user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};
