import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { convertToISO8601 } from "../utils/convertToISO";

export const getAllItems = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query?.page as string) || 1;
    const perPage = parseInt(req.query?.perPage as string) || 10;
    const skip = (page - 1) * perPage;

    const totalCount = await prisma.item.count();
    const totalPages = Math.ceil(totalCount / perPage);

    const items = await prisma.item.findMany({
      take: perPage,
      skip,
    });

    res.status(200).json({
      totalItems: totalCount,
      totalPages,
      currentPage: page,
      perPage,
      items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching items" });
  }
};

export const getItemsByUser = async (req, res: Response) => {
  try {
    const userId = parseInt(req.user.id);
    const items = await prisma.item.findMany({
      where: { userId: userId },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching items" });
  }
}

export const getItemById = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.item.findUnique({ where: { id: itemId } });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching item" });
  }
};

export const createItem = async (req, res: Response) => {
  try {
    const { name, description, starting_price, end_time } = req.body;
    const image_url = req.file ? req.file.path : null;

    const isoEndTime = convertToISO8601(end_time);

    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        starting_price,
        end_time: isoEndTime,
        image_url,
        userId: req.user.id,
      },
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating item" });
  }
};

export const updateItem = async (req, res: Response) => {
  const itemId = parseInt(req.params.id);
  const { name, description, starting_price, end_time } = req.body;
  const image_url = req.file ? req.file.path : null;

  const isoEndTime = convertToISO8601(end_time);

  try {
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (existingItem.userId === req.user.id || req.user.role === "ADMIN") {
      const updatedItem = await prisma.item.update({
        where: { id: itemId },
        data: {
          name,
          description,
          starting_price,
          end_time: isoEndTime,
          image_url,
        },
      });

      return res.status(200).json(updatedItem);
    }

    return res.status(403).json({ message: "Forbidden: Access is denied" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteItem = async (req, res: Response) => {
  const itemId = parseInt(req.params.id);
  try {
    const existingItem = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (existingItem.userId === req.user.id || req.user.role === "ADMIN") {
      await prisma.item.delete({ where: { id: itemId } });

      return res.status(200).send({
        message: "Item deleted successfully",
      });
    }

    return res.status(403).json({ message: "Forbidden: Access is denied" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
