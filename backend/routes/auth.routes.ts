import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db/prisma";

const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: passwordHash } });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
