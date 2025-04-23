import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.routes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.send("Express server is working correctly!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.info(`Server is running on PORT: ${port}`);
});
