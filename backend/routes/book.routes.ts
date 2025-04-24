import express from "express";
import prisma from "../db/prisma";
import { seedBooksIfNoneExist } from "../services/book.service";

const router = express.Router();

// GET /api/books?page=1&limit=10&search=js
router.get("/", async (req, res) => {
  try {
    await seedBooksIfNoneExist();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string)?.trim().toLowerCase() || "";
    const skip = (page - 1) * limit;

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        skip,
        take: limit,
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
      prisma.book.count({
        where: search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { author: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
      }),
    ]);

    res.json({
      data: books,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/books/:id
router.get("/:id", async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: req.params.id } });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    console.error("Error fetching book details:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
