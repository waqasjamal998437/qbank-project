// Use relative path to avoid alias resolution issues
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  // Environment check at route level
  console.log("🔍 Checking DB URL:", !!process.env.DATABASE_URL);
  console.log("🔍 DB URL preview:", process.env.DATABASE_URL?.substring(0, 30) + "...");
  
  try {
    // Test connection first
    await db.$connect();
    console.log("✅ Database connection successful");
    
    const counter = await db.counter.findUnique({ where: { id: 1 } });
    console.log("✅ Counter query successful:", counter);
    
    return NextResponse.json({ count: counter?.value ?? 0 });
  } catch (error: any) {
    // Full error logging with stack trace
    console.error("❌ GET ERROR - Full Details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
      error: error,
      name: error.name,
      cause: error.cause,
    });
    return NextResponse.json({ count: 0, error: error.message }, { status: 500 });
  } finally {
    // Don't disconnect in API routes - keep connection alive
    // await db.$disconnect();
  }
}

export async function POST(request: Request) {
  // Environment check at route level
  console.log("🔍 Checking DB URL:", !!process.env.DATABASE_URL);
  console.log("🔍 DB URL preview:", process.env.DATABASE_URL?.substring(0, 30) + "...");
  
  try {
    // Test connection first
    await db.$connect();
    console.log("✅ Database connection successful");
    
    const { newValue } = await request.json();

    if (typeof newValue !== "number" && typeof newValue !== "string") {
      throw new Error("newValue must be a number");
    }

    console.log("📝 Attempting upsert with value:", newValue);

    // In Prisma 7, sometimes upsert needs a very clean object
    const counter = await db.counter.upsert({
      where: { id: 1 },
      update: { value: Number(newValue) },
      create: { id: 1, value: Number(newValue) },
    });

    console.log("✅ Upsert successful:", counter);
    return NextResponse.json({ count: counter.value });
  } catch (error: any) {
    // FULL_ERROR_LOG with complete details
    console.error("FULL_ERROR_LOG:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
      error: error,
      name: error.name,
      cause: error.cause,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  // Environment check at route level
  console.log("🔍 Checking DB URL:", !!process.env.DATABASE_URL);
  
  try {
    await db.counter.update({
      where: { id: 1 },
      data: { value: 0 },
    });
    return NextResponse.json({ count: 0 });
  } catch (error: any) {
    // Full error logging with stack trace
    console.error("❌ DELETE ERROR - Full Details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
      error: error,
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}