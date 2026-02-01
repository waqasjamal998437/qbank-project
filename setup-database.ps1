# PowerShell script to help set up the database tables
# This script provides instructions and can verify your DATABASE_URL

Write-Host "🔍 Database Setup Helper" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "✅ .env file found" -ForegroundColor Green
    
    # Check if DATABASE_URL is set (without showing the actual value)
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "DATABASE_URL") {
        Write-Host "✅ DATABASE_URL is configured in .env" -ForegroundColor Green
    } else {
        Write-Host "❌ DATABASE_URL not found in .env" -ForegroundColor Red
        Write-Host "   Please add: DATABASE_URL='your-supabase-connection-string'" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env file not found" -ForegroundColor Red
    Write-Host "   Please create .env file with DATABASE_URL" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPTION 1: Run SQL in Supabase Dashboard (Easiest)" -ForegroundColor Yellow
Write-Host "   1. Go to: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   2. Select your project" -ForegroundColor White
Write-Host "   3. Click 'SQL Editor' in the left sidebar" -ForegroundColor White
Write-Host "   4. Open 'create-tables.sql' from this project" -ForegroundColor White
Write-Host "   5. Copy all SQL and paste into Supabase SQL Editor" -ForegroundColor White
Write-Host "   6. Click 'Run' or press Ctrl+Enter" -ForegroundColor White
Write-Host "   7. Verify tables in 'Table Editor'" -ForegroundColor White
Write-Host ""
Write-Host "OPTION 2: Use Prisma (If permissions allow)" -ForegroundColor Yellow
Write-Host "   Run PowerShell as Administrator, then:" -ForegroundColor White
Write-Host "   npx prisma db push" -ForegroundColor Cyan
Write-Host ""
Write-Host "After creating tables, restart your dev server:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
