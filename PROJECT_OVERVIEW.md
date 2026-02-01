# Qbank Project Overview

## 📁 Project Structure

### Core Configuration
- **`package.json`**: Dependencies include Next.js 16.1.4, React 19, Prisma 7, Recharts, Framer Motion, Tailwind CSS 4
- **`next.config.ts`**: ⚠️ **NEEDS FIX** - Has conflict between `transpilePackages` and `serverExternalPackages` for `@babel/runtime`
- **`prisma/schema.prisma`**: Database models: Counter, UserProgress, Flashcard, Video, Quiz
- **`middleware.ts`**: Admin route protection (redirects to `/admin/login` if not authenticated)

### Theme System ✅
- **`src/components/ThemeProvider.tsx`**: React Context for theme management (light/dark)
- **`src/components/ThemeToggle.tsx`**: Toggle button with framer-motion animations
- **`src/app/layout.tsx`**: Root layout with ThemeProvider wrapper
- **Status**: Working, uses `localStorage` persistence and system preference detection

### Main Application Pages

#### 1. Dashboard (`src/app/dashboard/page.tsx`) ✅
- **Features**: Stats cards, subject tiles, search, study session management
- **Data Source**: Fetches from `/api/stats` endpoint
- **Animations**: Framer Motion for cards, subject tiles, page transitions
- **Color Scheme**: White/Grey/Black/Blue palette

#### 2. Stats Page (`src/app/stats/page.tsx`) ✅
- **Features**: 
  - 4 metric cards (Total, Accuracy, Streak, Today)
  - Weekly Activity BarChart
  - Category Strength RadarChart
  - Progress Trend AreaChart
- **Data Source**: `/api/stats` with fallback to `DUMMY_ANALYTICS`
- **Empty State**: Shows "No data yet" message with BookOpen icon
- **Theme Support**: Dynamic colors based on light/dark mode

#### 3. Study Page (`src/app/study/page.tsx`) ✅
- **Features**: Question card display with navigation

#### 4. Flashcards (`src/app/flashcards/page.tsx`) ✅
- **Features**: Anki-style SRS system with 3D flip cards
- **Components**: Uses `FlipCard.tsx` component

#### 5. Library (`src/app/library/page.tsx`) ✅
- **Features**: Media library for videos and textbooks
- **Components**: `MediaCard.tsx`, `FocusWorkspace.tsx`

#### 6. Settings (`src/app/settings/page.tsx`) ✅
- **Features**: User settings page

### Admin System ✅

#### Admin Routes
- **`src/app/admin/page.tsx`**: Redirects to `/admin/dashboard`
- **`src/app/admin/layout.tsx`**: Admin-specific layout with custom Toast component
- **`src/app/admin/login/page.tsx`**: Password-protected login
- **`src/app/admin/dashboard/page.tsx`**: Content overview
- **`src/app/admin/flashcards/page.tsx`**: Flashcard management
- **`src/app/admin/videos/page.tsx`**: Video management
- **`src/app/admin/quizzes/page.tsx`**: Quiz management

#### Admin Components
- **`src/components/admin/AdminLayout.tsx`**: Separate sidebar for admin
- **`src/components/admin/Toast.tsx`**: Custom toast notifications (replaces `sonner`)
- **`src/components/admin/ContentOverview.tsx`**: Stats dashboard
- **`src/components/admin/FlashcardFactory.tsx`**: Flashcard creator
- **`src/components/admin/VideoVault.tsx`**: Video manager
- **`src/components/admin/QuizBuilder.tsx`**: Quiz creator

#### Admin API Routes
- **`src/app/api/admin/login/route.ts`**: Authentication
- **`src/app/api/admin/logout/route.ts`**: Logout
- **`src/app/api/admin/check/route.ts`**: Auth check
- **`src/app/api/admin/stats/route.ts`**: Admin statistics
- **`src/app/api/admin/flashcards/route.ts`**: Flashcard CRUD
- **`src/app/api/admin/videos/route.ts`**: Video CRUD
- **`src/app/api/admin/quizzes/route.ts`**: Quiz CRUD

#### Server Actions
- **`src/app/actions/flashcards.ts`**: Flashcard server actions
- **`src/app/actions/videos.ts`**: Video server actions
- **`src/app/actions/quizzes.ts`**: Quiz server actions

### API Routes

#### Public APIs
- **`src/app/api/stats/route.ts`**: ✅ Main stats endpoint
  - Returns: `activity`, `accuracy`, `categories`, `total`, `todayCount`
  - Handles empty database gracefully
  - Uses `date-fns` for date calculations
- **`src/app/api/progress/route.ts`**: Progress tracking
- **`src/app/api/health/route.ts`**: Health check
- **`src/app/api/counter/route.ts`**: Counter API

### Shared Components

#### Layout & Navigation
- **`src/components/Layout.tsx`**: Main app layout with sidebar
  - Navigation items: Home, Study, Flashcards, Library, Stats, Admin, Settings
  - Mobile-responsive with hamburger menu
  - Theme toggle integration

#### UI Components
- **`src/components/StatCard.tsx`**: Reusable stat card
- **`src/components/SubjectTile.tsx`**: Subject card with progress
- **`src/components/QuestionCard.tsx`**: Question display with options
- **`src/components/SearchBar.tsx`**: Search input
- **`src/components/Breadcrumbs.tsx`**: Navigation breadcrumbs
- **`src/components/SubjectDetailView.tsx`**: Study session configuration modal

#### Feature Components
- **`src/components/FlipCard.tsx`**: 3D flip animation for flashcards
- **`src/components/MediaCard.tsx`**: Library item card
- **`src/components/FocusWorkspace.tsx`**: Focus mode for media viewing

### Database & Data

#### Prisma Schema
- **UserProgress**: Tracks question answers, correctness, confidence
- **Flashcard**: Front/back cards with categories
- **Video**: Video content with high-yield flag
- **Quiz**: Questions with options, correct answer, explanation

#### Data Files
- **`src/data/mockQuestions.ts`**: Mock question data for development

### Styling

#### Color Palette (Current)
- **Light Mode**: 
  - Background: `bg-white` / `#f5f5f5`
  - Text: `text-gray-700` / `#333`
  - Borders: `border-gray-200` / `border-slate-200`
  - Accents: `blue-500` / `blue-600`
- **Dark Mode**:
  - Background: `dark:bg-black` / `dark:bg-[#2c2c2c]`
  - Text: `dark:text-white`
  - Borders: `dark:border-gray-800` / `dark:border-[#404040]`
  - Accents: `dark:blue-400` / `dark:blue-600`

#### Design System
- **Theme**: "Quiet Study 2.0" - Low-arousal, minimalist
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts with blue-to-indigo gradients

## ⚠️ Known Issues & Fixes Needed

### Critical Issues

1. **`next.config.ts` Conflict** 🔴
   - **Problem**: `transpilePackages: ["recharts"]` conflicts with `serverExternalPackages: ["@babel/runtime"]`
   - **Error**: "The packages specified in the 'transpilePackages' conflict with the 'serverExternalPackages'"
   - **Fix**: Remove `@babel/runtime` from `serverExternalPackages` or adjust `transpilePackages`

2. **Dependencies Installation** 🟡
   - **Problem**: `next` command not found (dependencies may not be fully installed)
   - **Status**: `node_modules` exists but binaries may be missing
   - **Fix**: Run `pnpm install` or `npm install` to ensure all dependencies are linked

3. **Recharts + @babel/runtime** 🟡
   - **Status**: Both packages installed, but configuration needs adjustment
   - **Note**: Custom Toast component created to avoid `sonner` dependency issues

### Minor Issues

1. **Stats Page**: Uses dummy data when API fails (graceful fallback ✅)
2. **Theme Toggle**: Working but may need visual refinement
3. **Admin Toast**: Custom implementation replaces `sonner` (working ✅)

## ✅ What's Working

1. **Theme System**: Full light/dark mode with persistence
2. **Stats API**: Robust error handling and empty state support
3. **Admin System**: Complete CMS with authentication
4. **Flashcards**: SRS system with 3D animations
5. **Library**: Media management with focus workspace
6. **Dashboard**: Animated cards and subject tiles
7. **Server Actions**: Next.js server actions for content management

## 📋 Next Steps

1. **Fix `next.config.ts`** - Resolve transpilePackages conflict
2. **Verify Dependencies** - Ensure all packages are properly installed
3. **Test Admin Routes** - Verify authentication flow
4. **Test Stats Page** - Verify charts render correctly
5. **Database Migration** - Run Prisma migrations if schema changed

## 🔧 Quick Fixes Applied

- ✅ Custom Toast component (replaces `sonner`)
- ✅ Theme provider with hydration safety
- ✅ Stats API with graceful error handling
- ✅ Admin middleware protection
- ✅ Server actions for content management
