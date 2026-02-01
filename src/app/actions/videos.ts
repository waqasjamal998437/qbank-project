"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

// Helper function to validate db is initialized
function validateDb() {
  if (!db) {
    console.error("❌ Database client (db) is undefined");
    throw new Error("Database client is not initialized. Please restart the development server.");
  }
  if (!db.video) {
    console.error("❌ Database client does not have 'video' model");
    console.error("📋 This usually means Prisma client needs to be regenerated.");
    console.error("   The Prisma client is missing the Video, Flashcard, and Quiz models.");
    console.error("   Run: npx prisma generate (or .\\regenerate-prisma.ps1)");
    console.error("   Then restart your development server.");
    throw new Error(
      "Database schema not loaded. The Prisma client is missing the Video model.\n\n" +
      "To fix this:\n" +
      "1. Ensure you have internet connectivity\n" +
      "2. Run: npx prisma generate\n" +
      "   Or use the script: .\\regenerate-prisma.ps1\n" +
      "3. Restart your development server\n\n" +
      "Note: Prisma needs to download binaries, so internet is required."
    );
  }
}

export async function createVideo(formData: FormData) {
  try {
    // Validate db first
    validateDb();

    const title = formData.get("title") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string;
    const isHighYield = formData.get("isHighYield") === "true";

    if (!title?.trim() || !url?.trim() || !category?.trim()) {
      return { success: false, error: "Title, URL, and Category are required" };
    }

    // Validate URL format
    try {
      new URL(url.trim());
    } catch {
      return { success: false, error: "Invalid URL format" };
    }

    await db.video.create({
      data: {
        title: title.trim(),
        url: url.trim(),
        category: category.trim(),
        isHighYield,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/library");
    revalidatePath("/stats");
    revalidatePath("/admin/videos");

    return { success: true };
  } catch (error: any) {
    console.error("Error creating video:", error);
    // Provide more specific error messages
    if (error.code === "P2002") {
      return { success: false, error: "A video with this URL already exists" };
    }
    return { success: false, error: error.message || "Failed to create video" };
  }
}

export async function deleteVideo(id: string) {
  try {
    // Validate db first
    validateDb();

    await db.video.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/library");
    revalidatePath("/stats");

    return { success: true };
  } catch (error) {
    console.error("Error deleting video:", error);
    return { success: false, error: "Failed to delete video" };
  }
}
