"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

// Helper function to validate db is initialized
function validateDb() {
  if (!db) {
    console.error("❌ Database client (db) is undefined");
    throw new Error("Database client is not initialized. Please restart the development server.");
  }
  if (!db.flashcard) {
    console.error("❌ Database client does not have 'flashcard' model");
    console.error("📋 This usually means Prisma client needs to be regenerated.");
    console.error("   Run: npx prisma generate (or .\\regenerate-prisma.ps1)");
    throw new Error(
      "Database schema not loaded. The Prisma client is missing the Flashcard model.\n\n" +
      "To fix: Run 'npx prisma generate' and restart the server."
    );
  }
}

export async function createFlashcard(formData: FormData) {
  try {
    // Validate db first
    validateDb();

    const front = formData.get("front") as string;
    const back = formData.get("back") as string;
    const category = formData.get("category") as string;

    if (!front?.trim() || !back?.trim() || !category?.trim()) {
      return { success: false, error: "All fields are required" };
    }

    await db.flashcard.create({
      data: {
        front: front.trim(),
        back: back.trim(),
        category: category.trim(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/flashcards");
    revalidatePath("/stats");

    return { success: true };
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return { success: false, error: "Failed to create flashcard" };
  }
}

export async function deleteFlashcard(id: string) {
  try {
    // Validate db first
    validateDb();

    await db.flashcard.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/flashcards");
    revalidatePath("/stats");

    return { success: true };
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return { success: false, error: "Failed to delete flashcard" };
  }
}
