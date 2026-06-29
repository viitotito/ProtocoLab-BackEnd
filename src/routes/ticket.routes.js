import express from "express";

import * as ticketController from "../controllers/ticket.controller.js";

import commentRoutes from "../routes/comment.routes.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";

import {
  createTicketSchema,
  updateTicketSchema,
} from "../validations/ticket.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
  "/",
  validate(createTicketSchema),
  ticketController.createTicket
);

router.get(
  "/",
  ticketController.listTickets
);

router.get(
  "/:id",
  ticketController.getTicket
);

router.patch(
  "/:id",
  validate(updateTicketSchema),
  ticketController.updateTicket
);

router.delete(
  "/:id",
  ticketController.deleteTicket
);

router.post(
  "/:id/assignees",
  ticketController.assignUser
);

router.get(
  "/:id/assignees",
  ticketController.listAssignedUsers
);

router.delete(
  "/:id/assignees/:userId",
  ticketController.removeUser
);

router.use("/:id/comments", commentRoutes);

export default router;