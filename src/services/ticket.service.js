import prisma from "../configs/prisma.js";

export async function createTicket(companyId, ownerId, data) {
  const { title, description, departmentId } = data;

  const department = await prisma.department.findFirst({
    where: {
      id: departmentId,
      companyId,
    },
  });

  if (!department) {
    throw new Error("Departamento inválido para esta empresa.");
  }

  return prisma.ticket.create({
    data: {
      title,
      description,
      ownerId,
      departmentId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      status: true,
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

export async function getTicketById(id, companyId) {
  return prisma.ticket.findFirst({
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
}

export async function updateTicket(id, companyId, data) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id,

      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error("Chamado não encontrado.");
  }

  if (data.departmentId) {
    const department = await prisma.department.findFirst({
      where: {
        id: data.departmentId,
        companyId,
      },
    });

    if (!department) {
      throw new Error("Departamento inválido.");
    }
  }

  const updateData = { ...data };

  if (data.status === "CLOSED") {
    updateData.completion = new Date();
  }

  if (data.status === "OPEN" || data.status === "IN_PROGRESS") {
    updateData.completion = null;
  }

  await prisma.ticket.update({
    where: {
      id,
    },
    data: updateData,
  });

  return getTicketById(id, companyId);
}

export async function deleteTicket(id, companyId) {
  const deleted = await prisma.ticket.deleteMany({
    where: {
      id,

      department: {
        companyId,
      },
    },
  });

  if (deleted.count === 0) {
    throw new Error("Chamado não encontrado.");
  }

  return {
    message: "Chamado deletado com sucesso.",
  };
}

export async function assignUser(ticketId, userId, companyId) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error("Ticket não encontrado.");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      companyId,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const assignmentExists = await prisma.ticketAssignment.findUnique({
    where: {
      ticketId_userId: {
        ticketId,
        userId,
      },
    },
  });

  if (assignmentExists) {
    throw new Error("Usuário já está atribuído a este ticket.");
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

export async function listAssignedUsers(ticketId, companyId) {
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
    throw new Error("Ticket não encontrado.");
  }

  return ticket.assignees.map((assignment) => assignment.user);
}

export async function removeUser(ticketId, userId, companyId) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error("Ticket não encontrado.");
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
    throw new Error("Atribuição não encontrada.");
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
    message: "Usuário removido do ticket com sucesso.",
  };
}