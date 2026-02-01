# Create Database Tables

## Problem

Error: `The table 'public.Video' does not exist in the current database.`

The Prisma client has been generated, but the actual database tables haven't been created yet.

## Solution Options

### Option 1: Use Prisma Migrate (Recommended if it works)

```powershell
cd c:\Users\Jamal\Desktop\qbank
npx prisma migrate dev --name init
```

Or if you get permission errors, try:
```powershell
npx prisma db push
```

### Option 2: Manual SQL Script (If Prisma fails)

If Prisma commands fail due to permission errors or network issues:

1. **Open your Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Navigate to: **SQL Editor**

2. **Run the SQL Script**
   - Open `create-tables.sql` from this project
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click **Run** or press `Ctrl+Enter`

3. **Verify Tables Created**
   - Go to: **Table Editor** in Supabase
   - You should see these tables:
     - ✅ Counter
     - ✅ UserProgress
     - ✅ Flashcard
     - ✅ Video
     - ✅ Quiz

### Option 3: Fix Permission Issues (For Prisma)

If you get `EPERM` (permission error) when running Prisma:

1. **Run PowerShell as Administrator**
   - Right-click PowerShell
   - Select "Run as Administrator"
   - Navigate to project: `cd c:\Users\Jamal\Desktop\qbank`
   - Run: `npx prisma db push`

2. **Check Antivirus**
   - Some antivirus software blocks Prisma's schema engine
   - Temporarily disable or add exception for:
     - `node_modules\.pnpm\@prisma+engines@*\schema-engine-windows.exe`

3. **Alternative: Use Supabase Migration**
   - Create a new migration in Supabase
   - Use the SQL from `create-tables.sql`

## After Creating Tables

1. **Restart your development server**
   ```powershell
   npm run dev
   ```

2. **Test the "Add Video" button**
   - It should work now!

## Verification

To verify tables exist, you can:

1. **Check in Supabase Dashboard**
   - Table Editor → Should show all 5 tables

2. **Or use Prisma Studio** (if it works)
   ```powershell
   npx prisma studio
   ```
   - Opens a browser interface to view/edit data

## Current Status

- ✅ Prisma schema defined (all 5 models)
- ✅ Prisma client generated (db.video available)
- ❌ Database tables not created yet
- ⚠️ Prisma db push failing due to EPERM (permission error)

## Next Steps

1. **Try Option 2 (Manual SQL)** - This is the most reliable if Prisma has issues
2. **Or fix permissions and use Option 1**
3. **Restart dev server after tables are created**
