import urllib.request, json

BASE = "http://localhost:8000"

# Test login
data = json.dumps({"email": "admin@skan.com", "password": "admin123"}).encode()
req = urllib.request.Request(f"{BASE}/api/auth/login", data=data, headers={"Content-Type": "application/json"})
try:
    r = urllib.request.urlopen(req, timeout=10)
    print(f"LOGIN OK: {r.read().decode()[:100]}")
except urllib.error.HTTPError as e:
    print(f"LOGIN Error {e.code}: {e.read().decode()[:200]}")

# Test register
data = json.dumps({"name": "User Test", "email": "usertest@test.com", "password": "test1234", "phone": "+201091020130"}).encode()
req = urllib.request.Request(f"{BASE}/api/auth/register", data=data, headers={"Content-Type": "application/json"})
try:
    r = urllib.request.urlopen(req, timeout=10)
    print(f"REGISTER OK: {r.read().decode()[:100]}")
except urllib.error.HTTPError as e:
    print(f"REGISTER Error {e.code}: {e.read().decode()[:200]}")

# Test phone login
data = json.dumps({"phone": "+201091020130", "password": "test1234"}).encode()
req = urllib.request.Request(f"{BASE}/api/auth/login", data=data, headers={"Content-Type": "application/json"})
try:
    r = urllib.request.urlopen(req, timeout=10)
    print(f"PHONE LOGIN OK: {r.read().decode()[:100]}")
except urllib.error.HTTPError as e:
    print(f"PHONE LOGIN Error {e.code}: {e.read().decode()[:200]}")

print("DONE")
