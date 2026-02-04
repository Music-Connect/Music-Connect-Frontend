# Simple Backend Test Script
$ErrorActionPreference = "Continue"
$base = "http://localhost:3001"

$total = 0
$passed = 0
$failed = 0

function Test-API {
    param([string]$Name, [string]$Url, [string]$Method = "GET", [object]$Body, [int]$Expected = 200)
    $global:total++
    try {
        $params = @{ Uri = $Url; Method = $Method; ContentType = "application/json"; UseBasicParsing = $true }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json) }
        $resp = Invoke-WebRequest @params -ErrorAction Stop
        if ($resp.StatusCode -eq $Expected) {
            Write-Host "[PASS] $Name" -ForegroundColor Green
            $global:passed++
            return $resp.Content | ConvertFrom-Json
        } else {
            Write-Host "[FAIL] $Name - Status: $($resp.StatusCode)" -ForegroundColor Red
            $global:failed++
        }
    } catch {
        Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
        $global:failed++
    }
}

Write-Host "`n=== BACKEND TESTS ===" -ForegroundColor Cyan

# Health Check
Test-API "Backend Health" "$base/health"

# Register User
$rand = Get-Random -Maximum 9999
$userData = @{
    usuario = "TestUser$rand"
    email = "test$rand@example.com"
    senha = "senha123"
    tipo_usuario = "contratante"
    telefone = "11999999999"
    cidade = "Sao Paulo"
    estado = "SP"
}

$user = Test-API "Register User" "$base/api/usuarios/auth/register" "POST" $userData 201
$userId = if ($user) { $user.data.user.id_usuario } else { $null }

# Login
if ($userData) {
    $login = @{ email = $userData.email; senha = $userData.senha }
    Test-API "Login" "$base/api/usuarios/auth/login" "POST" $login
}

# Get Users
Test-API "Get All Users" "$base/api/usuarios"
if ($userId) { Test-API "Get User by ID" "$base/api/usuarios/$userId" }

# Create Artist
$artistData = @{
    usuario = "Artist$rand"
    email = "artist$rand@example.com"
    senha = "senha123"
    tipo_usuario = "artista"
    genero_musical = "Rock"
    cidade = "Rio de Janeiro"
    estado = "RJ"
}

$artist = Test-API "Create Artist" "$base/api/artistas" "POST" $artistData 201
$artistId = if ($artist) { $artist.data.id_usuario } else { $null }

# Get Artists
Test-API "Get All Artists" "$base/api/artistas"
Test-API "Filter Artists by Genre" "$base/api/artistas?genero=Rock"

# Create Proposal
if ($userId -and $artistId) {
    $propData = @{
        id_contratante = $userId
        id_artista = $artistId
        titulo = "Festa Teste"
        descricao = "Proposta teste"
        data_evento = "2026-12-31"
        local_evento = "Sao Paulo"
        valor_oferecido = 2500.00
    }
    $prop = Test-API "Create Proposal" "$base/api/propostas" "POST" $propData 201
    $propId = if ($prop) { $prop.data.id_proposta } else { $null }
    
    Test-API "Get Received Proposals" "$base/api/propostas/recebidas?id_artista=$artistId"
    Test-API "Get Sent Proposals" "$base/api/propostas/enviadas?id_contratante=$userId"
    
    if ($propId) {
        $status = @{ status = "aceita"; mensagem_resposta = "Aceito!" }
        Test-API "Update Proposal" "$base/api/propostas/$propId/status" "PUT" $status
    }
}

# Create Review
if ($userId -and $artistId) {
    $review = @{
        id_avaliador = $userId
        id_avaliado = $artistId
        nota = 5
        comentario = "Excelente!"
    }
    Test-API "Create Review" "$base/api/avaliacoes" "POST" $review 201
    Test-API "Get Reviews" "$base/api/avaliacoes/usuario/$artistId"
    Test-API "Get Average Rating" "$base/api/avaliacoes/usuario/$artistId/media"
}

Write-Host "`n=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Total: $total | Passed: $passed | Failed: $failed"
$rate = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }
Write-Host "Success Rate: $rate percent" -ForegroundColor $(if ($rate -ge 80) { 'Green' } else { 'Yellow' })

exit $(if ($failed -eq 0) { 0 } else { 1 })
