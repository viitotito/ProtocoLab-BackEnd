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

      owner: {
        select: {
          id: true,
          name: true,
        },
      },

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      opening: "desc",
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

      owner: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
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