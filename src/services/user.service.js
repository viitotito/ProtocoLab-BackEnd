import prisma from "../configs/prisma.js";

export async function listUsers(companyId) {
    return prisma.user.findMany({
        where: { companyId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            departmentId: true,
        },
    });
}