import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a pg pool using DATABASE_URL for the adapter
const pool = new pg.Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
});

// Create the PrismaPg adapter
const adapter = new PrismaPg(pool);

// We define the config separately to keep the types happy
const prismaClientOptions = {
  adapter,
  log: ["query" as const, "error" as const],
};

export const prisma =
  globalForPrisma.prisma || new PrismaClient(prismaClientOptions);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
