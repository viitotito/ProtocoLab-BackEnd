import * as ticketService from "../services/ticket.service.js";

export async function createTicket(req, res) {
  try {
    const ticket = await ticketService.createTicket(
      req.user.companyId,
      req.user.id,
      req.body
    );

    return res.status(201).json(ticket);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function listTickets(req, res) {
  try {
    const tickets = await ticketService.listTickets(req.user.companyId);

    return res.json(tickets);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function getTicket(req, res) {
  try {
    const ticket = await ticketService.getTicketById(
      Number(req.params.id),
      req.user.companyId
    );

    if (!ticket) {
      return res.status(404).json({
        message: "Chamado não encontrado.",
      });
    }

    return res.json(ticket);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function updateTicket(req, res) {
  try {
    const ticket = await ticketService.updateTicket(
      Number(req.params.id),
      req.user.companyId,
      req.body
    );

    return res.json(ticket);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}

export async function deleteTicket(req, res) {
  try {
    const result = await ticketService.deleteTicket(
      Number(req.params.id),
      req.user.companyId
    );

    return res.json(result);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }
}