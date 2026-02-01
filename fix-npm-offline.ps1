# PowerShell script to fix npm offline mode and install Prisma adapter

Write-Host "🔍 Checking npm configuration..." -ForegroundColor Cyan

# Check if npm is in cache-only mode
$npmConfig = npm config list
if ($npmConfig -match "cache.*only") {
    Write-Host "⚠️  npm appears to be in cache-only mode" -ForegroundColor Yellow
    Write-Host "Attempting to reset npm cache settings..." -ForegroundColor Yellow
    
    # Try to reset cache settings
    npm config delete cache
    npm config set fetch-retries 3
    npm config set fetch-retry-mintimeout 20000
    npm config set fetch-retry-maxtimeout 120000
}

Write-Host ""
Write-Host "📦 Installing @prisma/adapter-pg and pg..." -ForegroundColor Cyan
Write-Host ""

# Try npm first
Write-Host "Attempting with npm..." -ForegroundColor Yellow
npm install @prisma/adapter-pg pg

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "⚠️  npm install failed. Trying pnpm..." -ForegroundColor Yellow
    Write-Host ""
    
    # Try pnpm
    pnpm install @prisma/adapter-pg pg
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌ Both npm and pnpm failed." -ForegroundColor Red
        Write-Host ""
        Write-Host "MANUAL FIX REQUIRED:" -ForegroundColor Yellow
        Write-Host "1. Check your internet connection" -ForegroundColor White
        Write-Host "2. Check npm/pnpm configuration files (.npmrc, .pnpmrc)" -ForegroundColor White
        Write-Host "3. Try running: npm config set cache false" -ForegroundColor White
        Write-Host "4. Then run: npm install @prisma/adapter-pg pg" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host "Please restart your development server (npm run dev)" -ForegroundColor Green
