# PowerShell Script to add hora_evento column to propostas table
# This script connects to the PostgreSQL database and runs the migration

Write-Host "Adding hora_evento column to propostas table..." -ForegroundColor Cyan

# Database connection details (adjust if needed)
$env:PGPASSWORD = "musicconnect123"
$dbHost = "localhost"
$dbPort = "5432"
$dbName = "musicconnect"
$dbUser = "musicconnect"

# Run the migration
$scriptPath = Join-Path $PSScriptRoot "add-hora-evento.sql"

try {
    Write-Host "Executing migration script..." -ForegroundColor Yellow
    
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nMigration completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "`nMigration failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "Error executing migration: $_" -ForegroundColor Red
    exit 1
} finally {
    Remove-Item Env:\PGPASSWORD
}

Write-Host "`nDone!" -ForegroundColor Cyan
