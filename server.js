import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/configs/swagger.js";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import ticketRoutes from "./src/routes/ticket.routes.js";

import { i18nMiddleware } from "./src/middlewares/i18n.middleware.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(cookieParser());

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(i18nMiddleware);

app.use(
  "/api/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.headers["accept-language"] = req.headers["accept-language"] || "pt-BR";
        return req;
      },
    },
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "Server online",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
  });
});

const PORT = process.env.PORT || 3000;

const externalUrl = process.env.EXTERNAL_URL;

const server = app.listen(PORT, () => {
  const baseUrl = externalUrl || `http://localhost:${PORT}`;
  console.log(`Server running on: ${baseUrl}`);
});
