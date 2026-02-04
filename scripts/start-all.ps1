#!/usr/bin/env pwsh
# Start All Services - Music Connect

Write-Host "🚀 Starting Music Connect Services..." -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check if PostgreSQL is running
Write-Host "📊 Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgCheck = psql -U postgres -d music_connect -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is running" -ForegroundColor Green
    } else {
        throw "PostgreSQL check failed"
    }
} catch {
    Write-Host "❌ PostgreSQL is not running or database doesn't exist" -ForegroundColor Red
    Write-Host "   Run: psql -U postgres -d music_connect -f scripts/migrations.sql" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Start Backend Core
Write-Host "🔧 Starting Backend Core (port 3001)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Start BFF Mobile
Write-Host "📱 Starting BFF Mobile (port 3002)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd bff-mobile; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start BFF Web
Write-Host "🌐 Starting BFF Web (port 3003)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd bff-web; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 2

# Start Frontend Web
Write-Host "💻 Starting Frontend Web (port 3000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend-web/frontend-web; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ All services started!" -ForegroundColor Green
Write-Host ""
Write-Host "Services running on:" -ForegroundColor White
Write-Host "  - Backend Core:  http://localhost:3001" -ForegroundColor Gray
Write-Host "  - BFF Mobile:    http://localhost:3002" -ForegroundColor Gray
Write-Host "  - BFF Web:       http://localhost:3003" -ForegroundColor Gray
Write-Host "  - Frontend Web:  http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Write-Host "Health checks:" -ForegroundColor White
Write-Host "  - Backend:  curl http://localhost:3001/health" -ForegroundColor Gray
Write-Host "  - BFF Mobile: curl http://localhost:3002/health" -ForegroundColor Gray
Write-Host "  - BFF Web:  curl http://localhost:3003/health" -ForegroundColor Gray
Write-Host ""
Write-Host "To run tests: .\scripts\test-all.ps1" -ForegroundColor Yellow
Write-Host ""
