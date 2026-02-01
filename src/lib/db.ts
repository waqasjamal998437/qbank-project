import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = global as unknown as { db: PrismaClient };

// Environment check - Prisma 7 needs DATABASE_URL at runtime
if (!process.env.DATABASE_URL) {
  console.error("❌ CRITICAL: DATABASE_URL is not set in process.env");
  throw new Error("DATABASE_URL environment variable is required");
}

// Prisma 7 with Supabase requires a PostgreSQL adapter
// Prisma 7's new "prisma-client" provider requires either:
// 1. An adapter (e.g., @prisma/adapter-pg for PostgreSQL)
// 2. Prisma Accelerate (accelerateUrl)

let db: PrismaClient;

try {
  // Try to use @prisma/adapter-pg if available
  // Install with: npm install @prisma/adapter-pg pg
  let PrismaPg, Pool;
  
  try {
    PrismaPg = require("@prisma/adapter-pg").PrismaPg;
    Pool = require("pg").Pool;
  } catch (requireError: any) {
    console.error("❌ Failed to require adapter packages:", requireError.message);
    throw requireError;
  }
  
  if (!PrismaPg || !Pool) {
    throw new Error("PrismaPg or Pool is undefined after require");
  }
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  const adapter = new PrismaPg(pool);
  
  if (!adapter) {
    throw new Error("Failed to create PrismaPg adapter");
  }
  
  const prismaClientOptions: any = {
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  };
  
  db = globalForPrisma.db || new PrismaClient(prismaClientOptions);
  
  if (!db) {
    throw new Error("PrismaClient constructor returned undefined");
  }
  
  console.log("✅ Prisma Client initialized with PostgreSQL adapter");
} catch (adapterError: any) {
  // If adapter packages are not installed, provide helpful error
  if (
    adapterError.code === "MODULE_NOT_FOUND" ||
    adapterError.message?.includes("Cannot find module") ||
    adapterError.message?.includes("@prisma/adapter-pg")
  ) {
    console.error("❌ @prisma/adapter-pg is not installed");
    console.error("");
    console.error("📦 INSTALLATION REQUIRED:");
    console.error("   Run one of these commands in your terminal:");
    console.error("   npm install @prisma/adapter-pg pg");
    console.error("   or");
    console.error("   pnpm install @prisma/adapter-pg pg");
    console.error("");
    console.error("⚠️  If npm/pnpm is in offline mode, enable online mode first:");
    console.error("   See INSTALL_ADAPTER.md for detailed instructions");
    console.error("");
    throw new Error(
      "Prisma 7 requires @prisma/adapter-pg. Please install it:\n\n" +
      "npm install @prisma/adapter-pg pg\n" +
      "or\n" +
      "pnpm install @prisma/adapter-pg pg\n\n" +
      "Then restart your development server.\n\n" +
      "See INSTALL_ADAPTER.md for troubleshooting if npm/pnpm is offline."
    );
  }
  
  // If adapter initialization fails for other reasons, throw the error
  console.error("❌ Failed to initialize Prisma Client:", adapterError);
  throw adapterError;
}

// Ensure db is defined before exporting
if (!db) {
  throw new Error("Prisma Client failed to initialize. Check the error messages above.");
}

export { db };

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;
