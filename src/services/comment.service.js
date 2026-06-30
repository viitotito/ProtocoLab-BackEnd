import prisma from "../configs/prisma.js";

async function getTicket(ticketId, companyId, t) {
  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      department: {
        companyId,
      },
    },
  });

  if (!ticket) {
    throw new Error(t("comment:error.ticket_not_found"));
  }

  return ticket;
}

export async function createComment(ticketId, userId, companyId, data, t) {
  await getTicket(ticketId, companyId, t);

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

export async function listComments(ticketId, companyId, t) {
  await getTicket(ticketId, companyId, t);

  return prisma.comment.findMany({
    where: { ticketId },
    orderBy: { id: "asc" },
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
  data,
  t
) {
  await getTicket(ticketId, companyId, t);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error(t("comment:error.comment_not_found"));
  }

  if (comment.userId !== userId) {
    throw new Error(t("comment:error.not_allowed"));
  }

  return prisma.comment.update({
    where: { id: commentId },
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
  userId,
  t
) {
  await getTicket(ticketId, companyId, t);

  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      ticketId,
    },
  });

  if (!comment) {
    throw new Error(t("comment:error.comment_not_found"));
  }

  if (comment.userId !== userId) {
    throw new Error(t("comment:error.not_allowed"));
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return {
    message: t("comment:success.comment_deleted"),
  };
}