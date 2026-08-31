.PHONY: dev dev-services install start stop build clean

# Start only MySQL + Redis (backend & frontend run locally)
dev-services:
	docker compose -f docker-compose.dev.yml up -d

# Install Python backend
install-backend:
	cd backend && pip install -r requirements.txt

# Install React frontend
install-frontend:
	cd frontend && npm install

# Run dev servers (open 3 terminals)
dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

# Full Docker build & run
build:
	docker compose build

start:
	docker compose up -d

stop:
	docker compose down

logs:
	docker compose logs -f

# Clean everything
clean:
	docker compose down -v
	-docker volume rm skan_mysql_data skan_redis_data

# Production
prod:
	docker compose -f docker-compose.yml up -d --build
