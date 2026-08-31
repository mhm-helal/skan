$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
cd "C:\Users\hp\OneDrive\Documents\Default Project\skan\frontend"
node node_modules\vite\bin\vite.js --port 5173 --host
