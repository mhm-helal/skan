$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
$logFile = "C:\Users\hp\OneDrive\Documents\Default Project\skan\tunnel.log"

# Kill old
Get-Process -Name cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep 1

# Start tunnel and log output
$proc = Start-Process -FilePath "C:\Program Files (x86)\cloudflared\cloudflared.exe" -ArgumentList "tunnel --url http://localhost:5173" -RedirectStandardOutput $logFile -NoNewWindow -PassThru
Start-Sleep 10

# Read URL from log
$url = Get-Content $logFile | Select-String "trycloudflare.com" | Select-Object -First 1
Write-Host $url
