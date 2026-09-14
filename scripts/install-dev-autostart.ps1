# Registers a Windows logon task so localhost:3000 and :3333 start after every reboot.

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$EnsureScript = Join-Path $PSScriptRoot "ensure-dev-servers.ps1"
$TaskName = "ChrisMachineryDevServers"

if (-not (Test-Path $EnsureScript)) {
  throw "Missing $EnsureScript"
}

$arg = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$EnsureScript`""
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument $arg -WorkingDirectory $Root
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -StartWhenAvailable `
  -ExecutionTimeLimit ([TimeSpan]::Zero) `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force | Out-Null

Write-Host "Scheduled task '$TaskName' will start the site at logon."
Write-Host "Starting servers now..."
& $EnsureScript
Write-Host "Ready: http://localhost:3000  and  http://localhost:3333"
