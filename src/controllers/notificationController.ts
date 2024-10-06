import { Response } from "express";
import prisma from "../utils/prismaClient";

export const getNotifications = async (req, res: Response) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page as string) || 1;
  const perPage = parseInt(req.query.perPage as string) || 10;
  const skip = (page - 1) * perPage;

  try {
    const totalCount = await prisma.notification.count({ where: { userId } });
    const totalPages = Math.ceil(totalCount / perPage);

    const notifications = await prisma.notification.findMany({
      where: { userId },
      take: perPage,
      skip,
      orderBy: { created_at: "desc" },
    });

    res.status(200).json({
      totalNotifications: totalCount,
      totalPages,
      currentPage: page,
      perPage,
      notifications,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving notifications" });
  }
};

export const markNotificationsAsRead = async (req, res: Response) => {
  const userId = req.user.id;

  try {
    await prisma.notification.updateMany({
      where: { userId, is_read: false },
      data: { is_read: true },
    });
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error marking notifications as read" });
  }
};

export const createNotification = async (userId: number, message: string) => {
  await prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
};
