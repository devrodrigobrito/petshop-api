import express from "express";
import { requestIdMiddleware } from "./shared/middlewares/request-id.middleware";
import { errorHandler } from "./shared/middlewares/error.middleware";
import authRoutes from "./modules/auth/auth.routes";

export const app = express();

app.use(express.json());

app.use(requestIdMiddleware);

app.use("/api/v1/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);
