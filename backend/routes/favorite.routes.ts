import express from "express";
import { authenticateToken, AuthenticatedRequest } from "../middleware/auth";
import prisma from "../db/prisma";

const router = express.Router();

// POST /api/user/favorites/:bookId
router.post(
  "/:bookId",
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      const bookId = req.params.bookId;

      await prisma.user.update({
        where: { id: userId },
        data: { favorites: { connect: { id: bookId } } },
      });

      res.status(200).json({ message: "Book added to favorites" });
    } catch (err) {
      console.error("Failed to add favorite:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// GET /api/user/favorites
router.get("/", authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { favorites: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.favorites);
  } catch (err) {
    console.error("Failed to fetch favorites:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
