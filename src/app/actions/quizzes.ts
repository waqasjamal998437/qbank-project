"use server";

import { db } from "../../lib/db";
import { revalidatePath } from "next/cache";

// Helper function to validate db is initialized
function validateDb() {
  if (!db) {
    console.error("❌ Database client (db) is undefined");
    throw new Error("Database client is not initialized. Please restart the development server.");
  }
  if (!db.quiz) {
    console.error("❌ Database client does not have 'quiz' model");
    console.error("📋 This usually means Prisma client needs to be regenerated.");
    console.error("   Run: npx prisma generate (or .\\regenerate-prisma.ps1)");
    throw new Error(
      "Database schema not loaded. The Prisma client is missing the Quiz model.\n\n" +
      "To fix: Run 'npx prisma generate' and restart the server."
    );
  }
}

export async function createQuiz(formData: FormData) {
  try {
    // Validate db first
    validateDb();

    const question = formData.get("question") as string;
    const optionA = formData.get("optionA") as string;
    const optionB = formData.get("optionB") as string;
    const optionC = formData.get("optionC") as string;
    const optionD = formData.get("optionD") as string;
    const correctAnswer = parseInt(formData.get("correctAnswer") as string);
    const explanation = formData.get("explanation") as string;
    const category = formData.get("category") as string;
    const subcategory = formData.get("subcategory") as string;

    if (
      !question?.trim() ||
      !optionA?.trim() ||
      !optionB?.trim() ||
      !optionC?.trim() ||
      !optionD?.trim() ||
      isNaN(correctAnswer) ||
      !explanation?.trim() ||
      !category?.trim()
    ) {
      return { success: false, error: "All fields are required" };
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return { success: false, error: "Correct answer must be between 0 and 3" };
    }

    await db.quiz.create({
      data: {
        question: question.trim(),
        options: [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()],
        correctAnswer,
        explanation: explanation.trim(),
        category: category.trim(),
        subcategory: subcategory?.trim() || null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/study");
    revalidatePath("/stats");

    return { success: true };
  } catch (error) {
    console.error("Error creating quiz:", error);
    return { success: false, error: "Failed to create quiz question" };
  }
}

export async function deleteQuiz(id: string) {
  try {
    // Validate db first
    validateDb();

    await db.quiz.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
    revalidatePath("/study");
    revalidatePath("/stats");

    return { success: true };
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return { success: false, error: "Failed to delete quiz question" };
  }
}
