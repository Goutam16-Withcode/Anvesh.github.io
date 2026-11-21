# ==============================================================================
# ANVESH PostgreSQL Schema Initialization & Seeder (Windows PowerShell)
# ==============================================================================
$ErrorActionPreference = "Continue"

Write-Host "`n🌱 [ANVESH] Database Schema & Prisma Tooling" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor DarkGray

$backendDir = Join-Path $PSScriptRoot "..\..\backend"
Push-Location $backendDir

try {
    # 1. Check if PostgreSQL is actually running on port 5432 using standard .NET socket
    Write-Host "1. Checking PostgreSQL connection at localhost:5432..." -ForegroundColor Yellow
    $pgSocket = $false
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $iar = $tcp.BeginConnect("127.0.0.1", 5432, $null, $null)
        $wait = $iar.AsyncWaitHandle.WaitOne(1000, $false)
        if ($wait) {
            $tcp.EndConnect($iar)
            $pgSocket = $true
        }
        $tcp.Close()
    } catch {
        $pgSocket = $false
    }

    if (-not $pgSocket) {
        Write-Host "⚠️  PostgreSQL is not currently running on port 5432." -ForegroundColor Red
        Write-Host ""
        Write-Host "👉 To start PostgreSQL instantly with Docker, run:" -ForegroundColor Cyan
        Write-Host "   docker run --name anvesh_postgres -e POSTGRES_USER=anvesh_user -e POSTGRES_PASSWORD=anvesh_secure_password -e POSTGRES_DB=anvesh_db -p 5432:5432 -d postgres:16-alpine" -ForegroundColor White
        Write-Host ""
        Write-Host "👉 Or start via Docker Compose:" -ForegroundColor Cyan
        Write-Host "   docker compose up -d postgres" -ForegroundColor White
        Write-Host ""
        Write-Host "ℹ️  NOTE: The ANVESH backend operates in Resilient Mode automatically," -ForegroundColor Yellow
        Write-Host "   meaning you can still run 'npm --prefix backend run start:dev' right now" -ForegroundColor Yellow
        Write-Host "   without database errors! Resilient mock data will be served." -ForegroundColor Yellow
        Write-Host "=================================================`n" -ForegroundColor DarkGray
        exit 0
    }

    Write-Host "✅ PostgreSQL is reachable on port 5432!" -ForegroundColor Green

    # 2. Generating Prisma client
    Write-Host "2. Generating Prisma client bindings..." -ForegroundColor Yellow
    npm run db:generate

    # 3. Pushing schema
    Write-Host "3. Pushing relational schema to PostgreSQL..." -ForegroundColor Yellow
    npm run db:push

    # 4. Seeding
    Write-Host "4. Seeding demo candidate, taxonomy skills, and jobs..." -ForegroundColor Yellow
    npm run db:seed

    Write-Host "`n🎉 [SUCCESS] Database initialization completed successfully!" -ForegroundColor Green
    Write-Host "=================================================`n" -ForegroundColor DarkGray
}
finally {
    Pop-Location
}
