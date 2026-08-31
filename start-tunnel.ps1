$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
taskkill /F /IM cloudflared.exe 2>&1 | Out-Null
Start-Sleep 2
$proc = Start-Process -FilePath "C:\Program Files (x86)\cloudflared\cloudflared.exe" -ArgumentList "tunnel --url http://localhost:5173" -RedirectStandardError "C:\Users\hp\OneDrive\Documents\Default Project\skan\tunnel_url.txt" -NoNewWindow -PassThru
Start-Sleep 12
$lines = Get-Content "C:\Users\hp\OneDrive\Documents\Default Project\skan\tunnel_url.txt" -ErrorAction SilentlyContinue
$url = ($lines | Select-String "trycloudflare.com" | Select-Object -First 1) -replace '.*https://', 'https://' -replace '\s.*', ''
$url | Out-File "C:\Users\hp\OneDrive\Documents\Default Project\skan\current_url.txt"
Write-Host "Tunnel URL: $url"
Write-Host "Process alive: $(-not $proc.HasExited)"
