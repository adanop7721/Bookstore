import express from "express";
import prisma from "../db/prisma";
import { seedBooksIfNoneExist } from "../services/book.service";

const router = express.Router();

// GET /api/books
router.get("/", async (req, res) => {
  try {
    await seedBooksIfNoneExist();
    const books = await prisma.book.findMany();
    res.json(books);
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
