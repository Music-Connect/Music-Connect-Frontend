# PowerShell Script to add proposal fields to propostas table
# This script connects to the PostgreSQL database and runs the migration

Write-Host "Adding proposal fields to propostas table..." -ForegroundColor Cyan

# Database connection details (adjust if needed)
$env:PGPASSWORD = "musicconnect123"
$dbHost = "localhost"
$dbPort = "5432"
$dbName = "musicconnect"
$dbUser = "musicconnect"

# Run the migration
$scriptPath = Join-Path $PSScriptRoot "add-proposal-fields.sql"

try {
    Write-Host "Executing migration script..." -ForegroundColor Yellow
    
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`nMigration completed successfully!" -ForegroundColor Green
        Write-Host "The following columns were added to propostas table:" -ForegroundColor Green
        Write-Host "  - endereco_completo (TEXT)" -ForegroundColor Gray
        Write-Host "  - tipo_evento (VARCHAR(100))" -ForegroundColor Gray
        Write-Host "  - duracao_horas (DECIMAL(3,1))" -ForegroundColor Gray
        Write-Host "  - publico_esperado (INTEGER)" -ForegroundColor Gray
        Write-Host "  - equipamento_incluso (BOOLEAN)" -ForegroundColor Gray
        Write-Host "  - nome_responsavel (VARCHAR(255))" -ForegroundColor Gray
        Write-Host "  - telefone_contato (VARCHAR(20))" -ForegroundColor Gray
        Write-Host "  - observacoes (TEXT)" -ForegroundColor Gray
        Write-Host "  - hora_evento (TIME)" -ForegroundColor Gray
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
