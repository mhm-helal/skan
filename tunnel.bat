@echo off
cd /d "C:\Users\hp\OneDrive\Documents\Default Project\skan"
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:5173 > tunnel.log 2>&1
