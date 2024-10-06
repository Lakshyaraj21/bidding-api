import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const getAllItemBids = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id);
  const page = parseInt(req.query?.page as string) || 1;
  const perPage = parseInt(req.query?.perPage as string) || 10;

  try {
    const totalCount = await prisma.bid.count({ where: { itemId } });
    const totalPages = Math.ceil(totalCount / perPage);

    const itemBids = await prisma.bid.findMany({
      where: { itemId },
      skip: (page - 1) * perPage,
      take: perPage,
    });

    res.status(200).json({
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      perPage,
      bids: itemBids,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving bids" });
  }
};

export const createBidOnItem = async (req, res: Response) => {
  const itemId = parseInt(req.params.id);
  const { bid_amount } = req.body;

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (bid_amount >= item.starting_price) {
      const newBid = await prisma.bid.create({
        data: {
          bid_amount,
          item: { connect: { id: itemId } },
          user: { connect: { id: req.user.id } },
        },
      });
      res.status(200).json(newBid);
    } else {
      res.status(400).json({
        message: "Bid amount should be greater than the starting price",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing bid" });
  }
};

export const createBidOnItemWithNotification = async (req, res: Response) => {
  const itemId = parseInt(req.params.id);
  const { bid_amount } = req.body;

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (bid_amount >= item.starting_price) {
      const newBid = await prisma.bid.create({
        data: {
          bid_amount,
          item: { connect: { id: itemId } },
          user: { connect: { id: req.user.id } },
        },
      });

      await prisma.notification.create({
        data: {
          user: { connect: { id: item.userId } },
          message: `New bid of $${bid_amount} placed on your item ${item.name}`,
        },
      });

      res.status(200).json(newBid);
    } else {
      res.status(400).json({
        message: "Bid amount should be greater than the starting price",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing bid" });
  }
};

export const createBidOnItemWithOutbidNotification = async (
  req,
  res: Response,
) => {
  const itemId = parseInt(req.params.id);
  const { bid_amount } = req.body;

  try {
    const item = await prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    if (bid_amount >= item.starting_price) {
      const newBid = await prisma.bid.create({
        data: {
          bid_amount,
          item: { connect: { id: itemId } },
          user: { connect: { id: req.user.id } },
        },
      });

      await prisma.notification.create({
        data: {
          user: { connect: { id: item.userId } },
          message: `New bid of $${bid_amount} placed on your item ${item.name}`,
        },
      });

      const usersNotify = await prisma.bid.findMany({
        where: { itemId: itemId, bid_amount: { lt: newBid.bid_amount } },
        select: { userId: true, bid_amount: true },
        distinct: ["userId"],
      });

      const usersToNotify = usersNotify.map((user) => ({
        userId: user.userId,
        message: `You have been outbid on the item ${item.name}`,
      }));

      await sendNotifications(usersToNotify);

      res.status(200).json(newBid);
    } else {
      res.status(400).json({
        message: "Bid amount should be greater than the starting price",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error placing bid" });
  }
};

const sendNotifications = async (usersToNotify) => {
  const notifications = usersToNotify.map((user) => ({
    userId: user.userId,
    message: user.message,
  }));

  await prisma.notification.createMany({
    data: notifications,
    skipDuplicates: true,
  });
};
