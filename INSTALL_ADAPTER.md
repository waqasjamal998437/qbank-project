# Installing Prisma 7 PostgreSQL Adapter

## Problem
Prisma 7 requires `@prisma/adapter-pg` and `pg` packages to connect to PostgreSQL databases (including Supabase).

## Solution

### Step 1: Ensure npm/pnpm is online
If you're getting `cache mode is 'only-if-cached'` errors, you need to enable online mode:

**For npm:**
```powershell
npm config set cache false
# Or check your .npmrc file and remove any cache-only settings
```

**For pnpm:**
```powershell
pnpm config set store-dir "C:\Users\Jamal\AppData\Local\pnpm\store\v10" --global
pnpm install
```

### Step 2: Install the required packages

**Using npm:**
```powershell
cd c:\Users\Jamal\Desktop\qbank
npm install @prisma/adapter-pg pg
```

**Using pnpm:**
```powershell
cd c:\Users\Jamal\Desktop\qbank
pnpm install @prisma/adapter-pg pg
```

### Step 3: Restart your development server
After installing the packages, restart your Next.js development server:
```powershell
npm run dev
# or
pnpm dev
```

## Verification
Once installed, you should see this message in your console:
```
✅ Prisma Client initialized with PostgreSQL adapter
```

## Why is this needed?
Prisma 7 introduced a new client architecture that requires either:
1. An adapter (like `@prisma/adapter-pg` for PostgreSQL)
2. Prisma Accelerate (using `accelerateUrl`)

For Supabase and standard PostgreSQL connections, the adapter is required.
