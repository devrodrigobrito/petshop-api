import express from "express";
import { requestIdMiddleware } from "./shared/middlewares/request-id.middleware";
import { errorHandler } from "./shared/middlewares/error.middleware";

export const app = express();

app.use(express.json());

app.use(requestIdMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);
