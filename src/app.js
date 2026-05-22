import express from "express";
import cors from "cors";
import helmet from "helmet";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.config.js";
import { defaultLimiter, authLimiter } from "./config/rateLimit.config.js";
import connectDB from "./config/db.config.js";
import routes from "./routes/index.js";

import { errorHandler } from "./middleware/error.middleware.js";

const app = express();
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(defaultLimiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authLimiter);
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server   : http://localhost:${PORT}`);
  console.log(`API Docs : http://localhost:${PORT}/api-docs`);
});

export default app;
