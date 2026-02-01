# Script to regenerate Prisma client when internet is available
# Run this script when you have internet connectivity

Write-Host "🔄 Regenerating Prisma Client..." -ForegroundColor Cyan
Write-Host ""

# Check if Prisma is installed
if (-not (Test-Path "node_modules\.bin\prisma.cmd")) {
    Write-Host "❌ Prisma is not installed. Please run: npm install" -ForegroundColor Red
    exit 1
}

# Clean old generated files
Write-Host "🧹 Cleaning old generated files..." -ForegroundColor Yellow
if (Test-Path "src\generated\prisma") {
    Remove-Item -Recurse -Force "src\generated\prisma"
    Write-Host "   ✓ Removed src\generated\prisma" -ForegroundColor Green
}
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Recurse -Force "node_modules\.prisma"
    Write-Host "   ✓ Removed node_modules\.prisma" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Cyan

# Run Prisma generate
& "node_modules\.bin\prisma.cmd" generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Restart your development server (npm run dev)" -ForegroundColor White
    Write-Host "   2. Check that all models (Video, Flashcard, Quiz) are available" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Prisma generation failed. Check the error messages above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "   - Network connectivity (Prisma needs to download binaries)" -ForegroundColor White
    Write-Host "   - DATABASE_URL not set in .env file" -ForegroundColor White
    Write-Host "   - Prisma schema has syntax errors" -ForegroundColor White
    exit 1
}
