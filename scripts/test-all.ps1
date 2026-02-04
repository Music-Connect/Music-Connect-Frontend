#!/usr/bin/env pwsh
# Test Suite for Music Connect - Complete System
# Tests: Backend Core, BFF Mobile, BFF Web

Write-Host "🧪 Music Connect - Test Suite" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$baseBackend = "http://localhost:3001"
$baseBffMobile = "http://localhost:3002"
$baseBffWeb = "http://localhost:3003"

# Test counter
$totalTests = 0
$passedTests = 0
$failedTests = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null,
        [int]$ExpectedStatus = 200
    )
    
    $global:totalTests++
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-WebRequest @params -ErrorAction Stop
        
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✅ PASS: $Name" -ForegroundColor Green
            $global:passedTests++
            return $response.Content | ConvertFrom-Json
        } else {
            Write-Host "❌ FAIL: $Name (Status: $($response.StatusCode), Expected: $ExpectedStatus)" -ForegroundColor Red
            $global:failedTests++
            return $null
        }
    } catch {
        Write-Host "❌ FAIL: $Name - $($_.Exception.Message)" -ForegroundColor Red
        $global:failedTests++
        return $null
    }
}

# ========================================
# HEALTH CHECKS
# ========================================
Write-Host "`n🏥 Health Checks" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow

Test-Endpoint -Name "Backend Core Health" -Url "$baseBackend/health"
Test-Endpoint -Name "BFF Mobile Health" -Url "$baseBffMobile/health"
Test-Endpoint -Name "BFF Web Health" -Url "$baseBffWeb/health"

# ========================================
# BACKEND CORE TESTS
# ========================================
Write-Host "`n🔧 Backend Core Tests" -ForegroundColor Yellow
Write-Host "----------------------" -ForegroundColor Yellow

# Test Auth - Register
$registerData = @{
    usuario = "TesteUser$(Get-Random -Maximum 9999)"
    email = "teste$(Get-Random -Maximum 9999)@example.com"
    senha = "senha123"
    tipo_usuario = "contratante"
    telefone = "11999999999"
    cidade = "São Paulo"
    estado = "SP"
}

$registerResult = Test-Endpoint `
    -Name "Register User (Backend)" `
    -Url "$baseBackend/api/usuarios/auth/register" `
    -Method "POST" `
    -Body $registerData `
    -ExpectedStatus 201

$userId = $null
$token = $null
if ($registerResult) {
    $userId = $registerResult.data.user.id_usuario
    $token = $registerResult.data.token
    Write-Host "   User ID: $userId" -ForegroundColor Gray
}

# Test Auth - Login
if ($registerData) {
    $loginData = @{
        email = $registerData.email
        senha = $registerData.senha
    }
    
    $loginResult = Test-Endpoint `
        -Name "Login User (Backend)" `
        -Url "$baseBackend/api/usuarios/auth/login" `
        -Method "POST" `
        -Body $loginData
}

# Test Usuarios
Test-Endpoint -Name "Get All Users (Backend)" -Url "$baseBackend/api/usuarios"

if ($userId) {
    Test-Endpoint -Name "Get User by ID (Backend)" -Url "$baseBackend/api/usuarios/$userId"
}

# Test Artistas
$artistaData = @{
    usuario = "Artista$(Get-Random -Maximum 9999)"
    email = "artista$(Get-Random -Maximum 9999)@example.com"
    senha = "senha123"
    tipo_usuario = "artista"
    genero_musical = "Rock"
    cidade = "Rio de Janeiro"
    estado = "RJ"
    descricao = "Artista de teste"
}

$artistaResult = Test-Endpoint `
    -Name "Create Artist (Backend)" `
    -Url "$baseBackend/api/artistas" `
    -Method "POST" `
    -Body $artistaData `
    -ExpectedStatus 201

$artistaId = $null
if ($artistaResult) {
    $artistaId = $artistaResult.data.id_usuario
}

Test-Endpoint -Name "Get All Artists (Backend)" -Url "$baseBackend/api/artistas"
Test-Endpoint -Name "Filter Artists by Genre (Backend)" -Url "$baseBackend/api/artistas?genero=Rock"

# Test Propostas
if ($userId -and $artistaId) {
    $propostaData = @{
        id_contratante = $userId
        id_artista = $artistaId
        titulo = "Festa de Teste"
        descricao = "Proposta de teste"
        data_evento = "2026-12-31"
        local_evento = "São Paulo, SP"
        valor_oferecido = 2500.00
    }
    
    $propostaResult = Test-Endpoint `
        -Name "Create Proposal (Backend)" `
        -Url "$baseBackend/api/propostas" `
        -Method "POST" `
        -Body $propostaData `
        -ExpectedStatus 201
    
    $propostaId = $null
    if ($propostaResult) {
        $propostaId = $propostaResult.data.id_proposta
    }
    
    Test-Endpoint -Name "Get Received Proposals (Backend)" -Url "$baseBackend/api/propostas/recebidas?id_artista=$artistaId"
    Test-Endpoint -Name "Get Sent Proposals (Backend)" -Url "$baseBackend/api/propostas/enviadas?id_contratante=$userId"
    
    # Update proposal status
    if ($propostaId) {
        $statusData = @{
            status = "aceita"
            mensagem_resposta = "Aceito!"
        }
        
        Test-Endpoint `
            -Name "Update Proposal Status (Backend)" `
            -Url "$baseBackend/api/propostas/$propostaId/status" `
            -Method "PUT" `
            -Body $statusData
    }
}

# Test Avaliacoes
if ($userId -and $artistaId) {
    $avaliacaoData = @{
        id_avaliador = $userId
        id_avaliado = $artistaId
        nota = 5
        comentario = "Excelente artista!"
    }
    
    Test-Endpoint `
        -Name "Create Review (Backend)" `
        -Url "$baseBackend/api/avaliacoes" `
        -Method "POST" `
        -Body $avaliacaoData `
        -ExpectedStatus 201
    
    Test-Endpoint -Name "Get User Reviews (Backend)" -Url "$baseBackend/api/avaliacoes/usuario/$artistaId"
    Test-Endpoint -Name "Get Average Rating (Backend)" -Url "$baseBackend/api/avaliacoes/usuario/$artistaId/media"
}

# ========================================
# BFF MOBILE TESTS
# ========================================
Write-Host "`n📱 BFF Mobile Tests" -ForegroundColor Yellow
Write-Host "--------------------" -ForegroundColor Yellow

# Test Mobile Auth
$mobileLoginData = @{
    email = $registerData.email
    senha = $registerData.senha
}

Test-Endpoint `
    -Name "Login (Mobile BFF)" `
    -Url "$baseBffMobile/api/mobile/auth/login" `
    -Method "POST" `
    -Body $mobileLoginData

# Test Mobile Usuarios
if ($userId) {
    Test-Endpoint -Name "Get User Profile (Mobile BFF)" -Url "$baseBffMobile/api/mobile/usuarios/$userId"
}

# Test Mobile Artistas
Test-Endpoint -Name "Get Artists with Limit (Mobile BFF)" -Url "$baseBffMobile/api/mobile/artistas?limit=10"

if ($artistaId) {
    Test-Endpoint -Name "Get Artist with Reviews (Mobile BFF)" -Url "$baseBffMobile/api/mobile/artistas/$artistaId"
}

# Test Mobile Propostas
if ($userId -and $artistaId) {
    Test-Endpoint -Name "Get Received Proposals with Stats (Mobile BFF)" -Url "$baseBffMobile/api/mobile/propostas/recebidas?id_artista=$artistaId"
    Test-Endpoint -Name "Get Sent Proposals with Stats (Mobile BFF)" -Url "$baseBffMobile/api/mobile/propostas/enviadas?id_contratante=$userId"
}

# Test Mobile Avaliacoes
if ($artistaId) {
    Test-Endpoint -Name "Get Reviews Limited (Mobile BFF)" -Url "$baseBffMobile/api/mobile/avaliacoes/usuario/$artistaId?limit=5"
}

# ========================================
# BFF WEB TESTS
# ========================================
Write-Host "`n🌐 BFF Web Tests" -ForegroundColor Yellow
Write-Host "-----------------" -ForegroundColor Yellow

# Test Web Auth
$webLoginData = @{
    email = $registerData.email
    senha = $registerData.senha
}

Test-Endpoint `
    -Name "Login (Web BFF)" `
    -Url "$baseBffWeb/api/web/auth/login" `
    -Method "POST" `
    -Body $webLoginData

# Test Web Dashboard
if ($userId) {
    Test-Endpoint -Name "Get Dashboard Data (Web BFF)" -Url "$baseBffWeb/api/web/dashboard?id=$userId&tipo=contratante"
}

# Test Web Explore
Test-Endpoint -Name "Get Explore Data (Web BFF)" -Url "$baseBffWeb/api/web/explore"
Test-Endpoint -Name "Get Explore Filtered (Web BFF)" -Url "$baseBffWeb/api/web/explore?genero=Rock"

# Test Web Artistas
Test-Endpoint -Name "Get All Artists (Web BFF)" -Url "$baseBffWeb/api/web/artistas"

if ($artistaId) {
    Test-Endpoint -Name "Get Artist Complete Data (Web BFF)" -Url "$baseBffWeb/api/web/artistas/$artistaId"
}

# Test Web Propostas
if ($userId -and $artistaId) {
    Test-Endpoint -Name "Get Received Proposals (Web BFF)" -Url "$baseBffWeb/api/web/propostas/recebidas?id_artista=$artistaId"
    Test-Endpoint -Name "Get Sent Proposals (Web BFF)" -Url "$baseBffWeb/api/web/propostas/enviadas?id_contratante=$userId"
}

# Test Web Avaliacoes
if ($artistaId) {
    Test-Endpoint -Name "Get All Reviews (Web BFF)" -Url "$baseBffWeb/api/web/avaliacoes/usuario/$artistaId"
    Test-Endpoint -Name "Get Average Rating (Web BFF)" -Url "$baseBffWeb/api/web/avaliacoes/usuario/$artistaId/media"
}

# ========================================
# TEST SUMMARY
# ========================================
Write-Host "`n" -NoNewline
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 Test Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Total Tests:  $totalTests" -ForegroundColor White
Write-Host "Passed:       $passedTests" -ForegroundColor Green
Write-Host "Failed:       $failedTests" -ForegroundColor Red

$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 2) } else { 0 }
$rateColor = if ($successRate -ge 90) { 'Green' } elseif ($successRate -ge 70) { 'Yellow' } else { 'Red' }
Write-Host "Success Rate: $successRate percent" -ForegroundColor $rateColor
Write-Host ""

if ($failedTests -eq 0) {
    Write-Host 'All tests passed!' -ForegroundColor Green
    exit 0
} else {
    Write-Host 'Some tests failed. Check the output above.' -ForegroundColor Yellow
    exit 1
}
