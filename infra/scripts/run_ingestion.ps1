# ==============================================================================
# ANVESH Data Ingestion Pipeline Trigger (Windows PowerShell)
# ==============================================================================
param (
    [string]$Source = "sample",
    [int]$Limit = 25,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 [ANVESH] Triggering Ingestion Pipeline for Source: '$Source' (Limit: $Limit)..." -ForegroundColor Cyan

$repoRoot = Join-Path $PSScriptRoot "..\.."
Push-Location $repoRoot

$pythonPath = ".venv\Scripts\python.exe"
if (-not (Test-Path $pythonPath)) {
    $pythonPath = "python"
}

$cmdArgs = @("-m", "ingestion.pipelines.orchestrator", "--source", $Source, "--limit", $Limit)
if ($DryRun) {
    $cmdArgs += "--dry-run"
}

try {
    & $pythonPath $cmdArgs
    Write-Host "✅ Ingestion pipeline executed successfully!" -ForegroundColor Green
}
finally {
    Pop-Location
}
