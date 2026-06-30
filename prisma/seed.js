import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const company = await prisma.company.create({
    data: {
      name: "ProtocoLab",
      email: "admin@protocolab.com",
      cnpj: "12345678000190",
    },
  });

  const hr = await prisma.department.create({
    data: {
      name: "HR",
      description: "Human Resources",
      companyId: company.id,
    },
  });

  const it = await prisma.department.create({
    data: {
      name: "IT",
      description: "Information Technology",
      companyId: company.id,
    },
  });

  const finance = await prisma.department.create({
    data: {
      name: "Finance",
      description: "Finance Department",
      companyId: company.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@protocolab.com",
      password,
      role: "ADMIN",
      companyId: company.id,
      departmentId: hr.id,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Maria Smith",
      email: "maria@protocolab.com",
      password,
      role: "MANAGER",
      companyId: company.id,
      departmentId: hr.id,
    },
  });

  const employee = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@protocolab.com",
      password,
      role: "USER",
      companyId: company.id,
      departmentId: it.id,
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      title: "System error",
      description: "Unable to log into the system.",
      status: "OPEN",
      ownerId: employee.id,
      departmentId: it.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Laptop request",
      description: "Need a new laptop for onboarding employee.",
      status: "IN_PROGRESS",
      ownerId: manager.id,
      departmentId: hr.id,
    },
  });

  await prisma.ticketAssignment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        userId: admin.id,
      },
      {
        ticketId: ticket1.id,
        userId: manager.id,
      },
      {
        ticketId: ticket2.id,
        userId: admin.id,
      },
    ],
  });

  await prisma.comment.createMany({
    data: [
      {
        description: "Ticket received.",
        ticketId: ticket1.id,
        userId: admin.id,
      },
      {
        description: "Investigating the issue.",
        ticketId: ticket1.id,
        userId: manager.id,
      },
      {
        description: "Laptop requested from supplier.",
        ticketId: ticket2.id,
        userId: manager.id,
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });