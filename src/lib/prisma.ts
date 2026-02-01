import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// We define the config separately to keep the types happy
const prismaClientOptions = {
  log: ["query" as const, "error" as const],
};

export const prisma =
  globalForPrisma.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;