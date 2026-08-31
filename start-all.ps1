$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Kill old processes
Get-Process -Name cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name python -ErrorAction SilentlyContinue | Where-Object { $_.MainModule.FileName -like "*python*" } | Stop-Process -Force
Start-Sleep 2

# Start Backend
Start-Process -FilePath "python" -ArgumentList "-m uvicorn app.main:app --port 8000" -WorkingDirectory "C:\Users\hp\OneDrive\Documents\Default Project\skan\backend" -WindowStyle Hidden
Start-Sleep 5

# Start Frontend Server
Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory "C:\Users\hp\OneDrive\Documents\Default Project\skan" -WindowStyle Hidden
Start-Sleep 3

# Start Cloudflare Tunnel
Start-Process -FilePath "C:\Program Files (x86)\cloudflared\cloudflared.exe" -ArgumentList "tunnel --url http://localhost:5173" -WindowStyle Hidden

Write-Host "All services started!"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:8000"
