import express from "express";

import * as ticketController from "../controllers/ticket.controller.js";

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
  authorize(),
  ticketController.deleteTicket
);

export default router;