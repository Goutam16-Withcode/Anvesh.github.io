# ==============================================================================
# ANVESH PostgreSQL Schema Initialization & Seeder (Windows PowerShell)
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "🌱 [ANVESH] Initializing Database Schema via Prisma..." -ForegroundColor Cyan

$backendDir = Join-Path $PSScriptRoot "..\..\backend"
Push-Location $backendDir

try {
    Write-Host "1. Generating Prisma client bindings..." -ForegroundColor Yellow
    npm run db:generate

    Write-Host "2. Pushing relational schema to PostgreSQL..." -ForegroundColor Yellow
    npm run db:push

    Write-Host "3. Seeding taxonomy and demo entities..." -ForegroundColor Yellow
    npm run db:seed

    Write-Host "✅ Database initialization successfully completed!" -ForegroundColor Green
}
finally {
    Pop-Location
}
