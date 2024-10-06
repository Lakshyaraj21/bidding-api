import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

export const searchItems = async (req: Request, res: Response) => {
  try {
    const { query, page, perPage } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const itemsPerPage = parseInt(perPage as string) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const totalCount = await prisma.item.count({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
    });

    const items = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: query as string, mode: "insensitive" } },
          { description: { contains: query as string, mode: "insensitive" } },
        ],
      },
      take: itemsPerPage,
      skip,
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res
      .status(200)
      .json({
        totalCount,
        totalPages,
        currentPage: pageNumber,
        perPage: itemsPerPage,
        items,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching items" });
  }
};

export const filterItemsByStatus = async (req: Request, res: Response) => {
  try {
    const { status, page, perPage } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const itemsPerPage = parseInt(perPage as string) || 10;
    const skip = (pageNumber - 1) * itemsPerPage;

    if (!status || (status !== "active" && status !== "ended")) {
      return res.status(400).json({ message: "Invalid status parameter" });
    }

    const filterCondition =
      status === "active"
        ? { end_time: { gte: new Date() } }
        : { end_time: { lt: new Date() } };

    const totalCount = await prisma.item.count({
      where: filterCondition,
    });

    const items = await prisma.item.findMany({
      where: filterCondition,
      take: itemsPerPage,
      skip,
    });

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    res
      .status(200)
      .json({
        totalCount,
        totalPages,
        currentPage: pageNumber,
        perPage: itemsPerPage,
        items,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error filtering items by status" });
  }
};
