.PHONY: help dev build-dev clean logs logs-backend logs-frontend stop test sync restart-dev db-shell db-logs status

# Default target
help: ## Show this help message
	@echo "Game Configurator - Development Environment"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

sync: ## Sync git submodules
	@echo "🔄 Syncing git submodules..."
	git submodule update --init --recursive
	git submodule sync --recursive

dev: sync ## Start development environment (postgres + pocketbase + frontend + caddy)
	@echo "🔥 Starting development environment..."
	docker-compose -f docker-compose.dev.yaml up --build -d
	@echo "⏳ Waiting for services to be healthy..."
	docker-compose -f docker-compose.dev.yaml ps
	@echo "✅ Development environment ready!"
	@echo "  📱 Frontend: http://localhost:5173"
	@echo "  🔧 Backend:  http://localhost:8081"
	@echo "  🗄️  Database: localhost:5432"

build-dev: sync ## Build development images
	@echo "🔨 Building development images..."
	docker-compose -f docker-compose.dev.yaml build

logs: ## Show logs from development services
	docker-compose -f docker-compose.dev.yaml logs -f

logs-backend: ## Show logs from development backend (pocketbase)
	docker-compose -f docker-compose.dev.yaml logs -f pocketbase

logs-frontend: ## Show logs from development frontend
	docker-compose -f docker-compose.dev.yaml logs -f frontend

logs-db: ## Show logs from development database
	docker-compose -f docker-compose.dev.yaml logs -f postgres

stop: ## Stop all running services
	@echo "🛑 Stopping all services..."
	docker-compose -f docker-compose.dev.yaml down 2>/dev/null || true

clean: ## Remove all containers, images, and volumes
	@echo "🧹 Cleaning up containers, images, and volumes..."
	docker-compose -f docker-compose.dev.yaml down -v --rmi all 2>/dev/null || true

restart-dev: ## Restart development environment
	@echo "🔄 Restarting development environment..."
	docker-compose -f docker-compose.dev.yaml restart

test: ## Run Go tests with race detection in development environment
	@echo "🧪 Running Go tests with race detection..."
	docker-compose -f docker-compose.dev.yaml exec pocketbase go test -race -count 1 ./...

db-shell: ## Connect to development database
	docker-compose -f docker-compose.dev.yaml exec postgres psql -U user -d postgres

db-logs: ## Show database logs
	docker-compose -f docker-compose.dev.yaml logs -f postgres

status: ## Show status of development services
	@echo "📊 Development Services:"
	docker-compose -f docker-compose.dev.yaml ps