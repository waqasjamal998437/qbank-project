-- SQL script to create the required tables in Supabase
-- Run this in your Supabase SQL Editor if Prisma migrations fail

-- Create Counter table
CREATE TABLE IF NOT EXISTS "Counter" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "value" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- Create UserProgress table
CREATE TABLE IF NOT EXISTS "UserProgress" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "confidence" TEXT NOT NULL,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserProgress_questionId_key" ON "UserProgress"("questionId");
CREATE INDEX IF NOT EXISTS "UserProgress_questionId_idx" ON "UserProgress"("questionId");
CREATE INDEX IF NOT EXISTS "UserProgress_lastSeen_idx" ON "UserProgress"("lastSeen");

-- Create Flashcard table
CREATE TABLE IF NOT EXISTS "Flashcard" (
    "id" TEXT NOT NULL,
    "front" TEXT NOT NULL,
    "back" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Flashcard_category_idx" ON "Flashcard"("category");

-- Create Video table
CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isHighYield" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Video_category_idx" ON "Video"("category");

-- Create Quiz table
CREATE TABLE IF NOT EXISTS "Quiz" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[] NOT NULL,
    "correctAnswer" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Quiz_category_idx" ON "Quiz"("category");
