import subprocess, time, re, sys

log = open(r"C:\Users\hp\OneDrive\Documents\Default Project\skan\tunnel_log.txt", "w")

proc = subprocess.Popen(
    [r"C:\Program Files (x86)\cloudflared\cloudflared.exe", "tunnel", "--url", "http://localhost:5173"],
    stderr=subprocess.STDOUT,
    stdout=subprocess.PIPE,
    text=True,
    bufsize=1
)

url = None
start = time.time()
while time.time() - start < 30:
    line = proc.stdout.readline()
    if not line:
        time.sleep(0.1)
        continue
    log.write(line)
    log.flush()
    match = re.search(r'https://[a-zA-Z0-9-]+\.trycloudflare\.com', line)
    if match:
        url = match.group(0)
        break

log.close()

if url:
    with open(r"C:\Users\hp\OneDrive\Documents\Default Project\skan\TUNNEL_URL.txt", "w") as f:
        f.write(url)
else:
    with open(r"C:\Users\hp\OneDrive\Documents\Default Project\skan\TUNNEL_URL.txt", "w") as f:
        f.write("FAILED")
