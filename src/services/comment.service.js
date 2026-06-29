import prisma from "../configs/prisma.js";

async function getTicket(ticketId, companyId) {
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

  return ticket;
}

export async function createComment(ticketId, userId, companyId, data) {
  await getTicket(ticketId, companyId);

  return prisma.comment.create({
    data: {
      description: data.description,
      ticketId,
      userId,
    },
    select: {
      id: true,
      description: true,
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

export async function listComments(ticketId, companyId) {
  await getTicket(ticketId, companyId);

  return prisma.comment.findMany({
    where: {
      ticketId,
    },
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      description: true,
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

export async function updateComment(
  ticketId,
  commentId,
  companyId,
  userId,
  data
) {
  await getTicket(ticketId, companyId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error("Comentário não encontrado.");
  }

  if (comment.userId !== userId) {
    throw new Error("Você não pode editar este comentário.");
  }

  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      description: data.description,
    },
    select: {
      id: true,
      description: true,
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

export async function deleteComment(
  ticketId,
  commentId,
  companyId,
  userId
) {
  await getTicket(ticketId, companyId);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error("Comentário não encontrado.");
  }

  if (comment.userId !== userId) {
    throw new Error("Você não pode deletar este comentário.");
  }

  await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });

  return {
    message: "Comentário deletado com sucesso.",
  };
}