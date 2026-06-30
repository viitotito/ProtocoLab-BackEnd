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

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function listTickets(req, res) {
  try {
    const tickets = await ticketService.listTickets(req.user.companyId);

    return res.json(tickets);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function getTicket(req, res) {
  try {
    const ticket = await ticketService.getTicketById(
      Number(req.params.id),
      req.user.companyId
    );

    return res.json(ticket);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
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

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
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

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function assignUser(req, res) {
  try {
    const assignment = await ticketService.assignUser(
      Number(req.params.id),
      Number(req.body.userId),
      req.user.companyId
    );

    return res.status(201).json(assignment);
    
  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function listAssignedUsers(req, res) {
  try {
    const users = await ticketService.listAssignedUsers(
      Number(req.params.id),
      req.user.companyId
    );

    return res.json(users);

  } catch (err) {

    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}

export async function removeUser(req, res) {
  try {
    const result = await ticketService.removeUser(
      Number(req.params.id),
      Number(req.params.userId),
      req.user.companyId
    );

    return res.json(result);

  } catch (err) {
    
    return res.status(err.statusCode || 400).json({
      message: req.t(err.message),
    });
  }
}