# Starts the Next.js site (3000) and Sanity Studio (3333) if they are not already listening.
# Used after reboot (scheduled task) and can be run manually.

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$LogDir = Join-Path $Root "logs"

function Get-NodeHome {
  $fromPath = Get-Command node.exe -ErrorAction SilentlyContinue
  if ($fromPath) { return Split-Path $fromPath.Source }
  foreach ($dir in @(
      (Join-Path $env:ProgramFiles "nodejs"),
      (Join-Path ${env:ProgramFiles(x86)} "nodejs"),
      (Join-Path $env:LOCALAPPDATA "Programs\nodejs")
    )) {
    if ($dir -and (Test-Path (Join-Path $dir "node.exe"))) { return $dir }
  }
  throw "Node.js was not found. Install Node.js, then run scripts\install-dev-autostart.ps1 again."
}

function Test-ListeningPort([int]$Port) {
  try {
    $conns = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    return [bool]$conns
  } catch {
    $line = netstat -ano | Select-String -Pattern ":$Port\s+.*LISTENING"
    return [bool]$line
  }
}

function Start-NpmScript([string]$ScriptName, [int]$Port, [string]$LogName) {
  if (Test-ListeningPort $Port) { return }
  New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
  $logFile = Join-Path $LogDir $LogName
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logFile -Value "`r`n==== $ScriptName $stamp ====" -Encoding UTF8
  $quotedRoot = $Root.Replace("'", "''")
  $quotedLog = $logFile.Replace("'", "''")
  $cmd = "Set-Location -LiteralPath '$quotedRoot'; npm.cmd run $ScriptName 1>> '$quotedLog' 2>&1"
  Start-Process -FilePath "powershell.exe" -ArgumentList @(
    "-NoProfile",
    "-ExecutionPolicy", "Bypass",
    "-WindowStyle", "Hidden",
    "-Command", $cmd
  ) | Out-Null
}

function Ensure-Dependencies {
  Set-Location -LiteralPath $Root
  $nextPkg = Join-Path $Root "node_modules\next\package.json"
  if (-not (Test-Path $nextPkg)) {
    npm.cmd install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
      throw "npm install --legacy-peer-deps failed with exit $LASTEXITCODE"
    }
  }
}

$nodeHome = Get-NodeHome
$env:Path = "$nodeHome;$env:Path"

Ensure-Dependencies

Start-NpmScript -ScriptName "dev" -Port 3000 -LogName "web.log"
Start-NpmScript -ScriptName "sanity" -Port 3333 -LogName "studio.log"

$deadline = (Get-Date).AddMinutes(2)
while ((Get-Date) -lt $deadline) {
  $web = Test-ListeningPort 3000
  $studio = Test-ListeningPort 3333
  if ($web -and $studio) { exit 0 }
  Start-Sleep -Seconds 2
}

$missing = @()
if (-not (Test-ListeningPort 3000)) { $missing += "3000 (Next.js)" }
if (-not (Test-ListeningPort 3333)) { $missing += "3333 (Sanity Studio)" }
throw "Timed out waiting for: $($missing -join ', '). See files in $LogDir"
