# Medical QBank Backend Architecture

## Overview

This document describes the complete backend implementation for the Medical QBank and Flashcard platform, built with Next.js (App Router) and Supabase (PostgreSQL).

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [SM2 Spaced Repetition Algorithm](#sm2-spaced-repetition-algorithm)
4. [Admin Security](#admin-security)
5. [Setup Instructions](#setup-instructions)

---

## Database Schema

### Tables Created

| Table | Description |
|-------|-------------|
| `Question` | Medical questions with stem, explanation, and tags |
| `Option` | Multiple choice options linked to questions |
| `UserResponse` | User answers with timing and correctness |
| `ExamSession` | Persisted exam state for mid-exam saves |
| `Flashcard` | Flashcards with SM2 algorithm fields |

### Schema File

**Location:** [`prisma/schema.prisma`](prisma/schema.prisma)

### SQL Migration

**Location:** [`prisma/migration_2024_01_31_qbank_schema.sql`](prisma/migration_2024_01_31_qbank_schema.sql)

Run this in your Supabase SQL Editor if Prisma migrations fail.

---

## API Endpoints

### 1. GET /api/questions

Get questions with filtering capabilities.

**Query Parameters:**
- `system` - Filter by organ system (e.g., "GI", "Renal", "Cardio")
- `discipline` - Filter by discipline (e.g., "Path", "Pharm")
- `unused` - If "true", return only unanswered questions
- `limit` - Number of questions to return (default: 20)
- `offset` - Pagination offset (default: 0)

**Response:**
```json
{
  "questions": [...],
  "total": 100,
  "hasMore": true
}
```

---

### 2. GET /api/analytics

Get user performance analytics.

**Query Parameters:**
- `user_id` - Required. The user's ID

**Response:**
```json
{
  "user_id": "uuid",
  "overall_stats": {
    "total_questions": 150,
    "correct_count": 120,
    "accuracy_percentage": 80,
    "avg_time_ms": 45000
  },
  "by_system": [
    {
      "system_tag": "GI",
      "total": 50,
      "correct": 40,
      "accuracy_percentage": 80,
      "avg_time_ms": 42000
    }
  ],
  "recent_activity": [...]
}
```

---

### 3. POST /api/progress/save

Save exam session progress (for mid-exam persistence).

**Request Body:**
```json
{
  "session_id": "uuid (optional)",
  "user_id": "uuid",
  "mode": "timed",
  "question_ids": ["uuid1", "uuid2", ...],
  "current_index": 5,
  "responses": {
    "uuid1": { "selectedIndex": 1, "timeSpent": 30000, "flagged": false }
  },
  "time_remaining": 2700
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "saved_at": "2024-01-31T21:00:00.000Z"
}
```

---

### 4. POST /api/flashcards/review

Process flashcard review using SM2 algorithm.

**Request Body:**
```json
{
  "card_id": "uuid",
  "quality": 3,  // 0-5: 0=Again, 3=Good, 4=Easy, 5=Very Easy
  "user_id": "uuid (optional)"
}
```

**Response:**
```json
{
  "card_id": "uuid",
  "next_review_date": "2024-02-07T21:00:00.000Z",
  "interval": 6,
  "ease_factor": 2.5,
  "repetitions": 2
}
```

---

### 5. GET /api/flashcards/review

Get flashcards due for review.

**Query Parameters:**
- `user_id` - Get user's cards (includes system cards)
- `limit` - Max cards to return (default: 20)

---

### 6. POST /api/admin/add-question

Add a new question (admin only).

**Request Body:**
```json
{
  "stem": "Question stem text...",
  "explanation": "Explanation of correct answer...",
  "educational_objective": "Learning objective...",
  "system_tag": "GI",
  "discipline_tag": "Path",
  "difficulty": "medium",
  "options": [
    { "text": "Option A", "is_correct": true },
    { "text": "Option B", "is_correct": false },
    { "text": "Option C", "is_correct": false },
    { "text": "Option D", "is_correct": false }
  ]
}
```

**Response:**
```json
{
  "question_id": "uuid",
  "created_at": "2024-01-31T21:00:00.000Z"
}
```

---

## SM2 Spaced Repetition Algorithm

**Location:** [`src/lib/sm2.ts`](src/lib/sm2.ts)

### Quality Ratings

| Rating | Label | Description |
|--------|-------|-------------|
| 0 | Again | Complete blackout, wrong answer |
| 1 | Hard | Incorrect but remembered after seeing answer |
| 2 | Hard | Correct but with significant difficulty |
| 3 | Good | Correct with some hesitation |
| 4 | Easy | Perfect recall |
| 5 | Very Easy | Perfect recall, overwhelmingly easy |

### Algorithm Formula

```
EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
```

Where:
- EF = Ease Factor (starts at 2.5)
- q = Quality rating (0-5)

### Interval Calculation

| Repetitions | Interval |
|-------------|----------|
| 0 | 1 day |
| 1 | 6 days |
| 2+ | Previous interval × Ease Factor |

---

## Admin Security

**Location:** [`src/lib/admin-middleware.ts`](src/lib/admin-middleware.ts)

### How It Works

1. Extract Bearer token from `Authorization` header
2. Verify token with Supabase Auth
3. Check user metadata for `role: "admin"`
4. Return 403 if not admin

### Setting Admin Role

In Supabase, set the user's metadata:
```json
{
  "role": "admin"
}
```

---

## Setup Instructions

### 1. Update Environment Variables

Create or update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 2. Generate Prisma Client

```bash
# Using pnpm (recommended)
pnpm prisma generate

# Or using npm
npx prisma generate
```

### 3. Run Database Migration

Option A - Using Prisma:
```bash
pnpm prisma db push
```

Option B - Run SQL in Supabase Editor:
1. Open Supabase SQL Editor
2. Copy contents of `prisma/migration_2024_01_31_qbank_schema.sql`
3. Execute

### 4. Install Dependencies

```bash
pnpm install
```

---

## TypeScript Types

**Location:** [`src/types/database.ts`](src/types/database.ts)

All TypeScript interfaces for API requests/responses are defined here.

---

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── questions/route.ts
│   │   ├── analytics/route.ts
│   │   ├── progress/save/route.ts
│   │   ├── flashcards/review/route.ts
│   │   └── admin/add-question/route.ts
│   └── ...
├── lib/
│   ├── sm2.ts                    # SM2 Algorithm
│   ├── admin-middleware.ts       # Admin auth
│   └── supabase.ts              # Supabase client
├── types/
│   └── database.ts              # TypeScript types
└── ...
```

---

## Error Handling

All API routes follow consistent error handling:
- Return JSON with `{ error: "message" }` on failure
- Use appropriate HTTP status codes (400, 403, 404, 500)
- Log errors to console with context
