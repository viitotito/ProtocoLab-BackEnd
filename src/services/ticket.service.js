import prisma from "../configs/prisma.js";

const PRIORITIES = ["HIGH", "NORMAL", "LOW"];
const STATUS = ["OPEN", "IN_PROGRESS", "CLOSED"];

export async function createTicket(companyId, ownerId, data, t) {
  const { title, description, departmentId, priority } = data;

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      companyId,
    },
  });

  if (!department) {
    throw new Error(t("ticket:error.department_invalid"));
  }

  if (!PRIORITIES.includes(priority)) {
    throw new Error(t("ticket:error.invalid_priority"));
  }

  return prisma.ticket.create({
    data: {
      title,
      description,
      ownerId,
      departmentId,
      priority,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      opening: true,
      completion: true,

      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function listTickets(companyId) {
  return prisma.ticket.findMany({
    where: {
      department: {
        companyId,
      },
    },
    select: {
      id: true,
      title: true,
      status: true,
      opening: true,
      completion: true,

      department: {
        select: {
          id: true,
          name: true,
        },
      },

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      _count: {
        select: {
          assignees: true,
          comments: true,
        },
      },
    },
  });
}

export async function getTicketById(id, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      department: {
        companyId,
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      priority: true,
      opening: true,
      completion: true,

      department: {
        select: {
          id: true,
          name: true,
        },
      },

      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      assignees: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              departmentId: true,
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  return ticket;
}

export async function updateTicket(id, companyId, data, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  if (data.departmentId) {
    const department = await prisma.department.findFirst({
      where: {
        id: data.departmentId,
        companyId,
      },
    });

    if (!department) {
      throw new Error(t("ticket:error.department_invalid"));
    }
  }

  if (data.priority && !PRIORITIES.includes(data.priority)) {
    throw new Error(t("ticket:error.invalid_priority"));
  }

  if (data.status && !STATUS.includes(data.status)) {
    throw new Error(t("ticket:error.invalid_status"));
  }

  const updateData = { ...data };

  if (data.status === "CLOSED") {
    updateData.completion = new Date();
  }

  if (data.status === "OPEN" || data.status === "IN_PROGRESS") {
    updateData.completion = null;
  }

  await prisma.ticket.update({
    where: { id },
    data: updateData,
  });

  return prisma.ticket.findFirst({
    where: {
      id,
      department: { companyId },
    },
  });
}

export async function deleteTicket(id, companyId, t) {
  const deleted = await prisma.ticket.deleteMany({
    where: {
      id,
      department: {
        companyId,
      },
    },
  });

  if (deleted.count === 0) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  return {
    message: t("ticket:success.ticket_deleted"),
  };
}

export async function assignUser(ticketId, userId, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new Error(t("ticket:error.user_not_found"));
  }

  const exists = await prisma.ticketAssignment.findUnique({
    where: {
      ticketId_userId: {
        ticketId,
        userId,
      },
    },
  });

  if (exists) {
    throw new Error(t("ticket:error.already_assigned"));
  }

  return prisma.ticketAssignment.create({
    data: {
      ticketId,
      userId,
    },
    select: {
      ticketId: true,
      userId: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

export async function listAssignedUsers(ticketId, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
    select: {
      assignees: {
        select: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              departmentId: true,
            },
          },
        },
      },
    },
  });

  if (!ticket) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  return ticket.assignees.map((a) => a.user);
}

export async function removeUser(ticketId, userId, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error(t("ticket:error.ticket_not_found"));
  }

  const assignment = await prisma.ticketAssignment.findUnique({
    where: {
      ticketId_userId: {
        ticketId,
        userId,
      },
    },
  });

  if (!assignment) {
    throw new Error(t("ticket:error.assignment_not_found"));
  }

  await prisma.ticketAssignment.delete({
    where: {
      ticketId_userId: {
        ticketId,
        userId,
      },
    },
  });

  return {
    message: t("ticket:success.user_removed"),
  };
}