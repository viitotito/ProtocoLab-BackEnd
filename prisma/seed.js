import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash("12345678", 10);

  const company = await prisma.company.create({
    data: {
      name: "ProtocoLab",
      email: "admin@protocolab.com",
      cnpj: "12345678000190",
    },
  });

  const rh = await prisma.department.create({
    data: {
      name: "RH",
      description: "Recursos Humanos",
      companyId: company.id,
    },
  });

  const ti = await prisma.department.create({
    data: {
      name: "TI",
      description: "Tecnologia da Informação",
      companyId: company.id,
    },
  });

  const financeiro = await prisma.department.create({
    data: {
      name: "Financeiro",
      description: "Departamento Financeiro",
      companyId: company.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@protocolab.com",
      password: senha,
      role: "ADMIN",
      companyId: company.id,
      departmentId: rh.id,
    },
  });

  const gerente = await prisma.user.create({
    data: {
      name: "Maria Souza",
      email: "maria@protocolab.com",
      password: senha,
      role: "GERENTE",
      companyId: company.id,
      departmentId: rh.id,
    },
  });

  const colaborador = await prisma.user.create({
    data: {
      name: "João Silva",
      email: "joao@protocolab.com",
      password: senha,
      role: "USER",
      companyId: company.id,
      departmentId: ti.id,
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Erro no sistema",
      description: "Não é possível realizar login.",
      status: "OPEN",
      ownerId: colaborador.id,
      departmentId: ti.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "Solicitação de notebook",
      description: "Necessário equipamento para novo colaborador.",
      status: "IN_PROGRESS",
      ownerId: gerente.id,
      departmentId: rh.id,
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
        userId: gerente.id,
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
        description: "Chamado recebido.",
        ticketId: ticket1.id,
        userId: admin.id,
      },
      {
        description: "Analisando problema.",
        ticketId: ticket1.id,
        userId: gerente.id,
      },
      {
        description: "Notebook solicitado ao fornecedor.",
        ticketId: ticket2.id,
        userId: gerente.id,
      },
    ],
  });

  console.log("Banco populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });