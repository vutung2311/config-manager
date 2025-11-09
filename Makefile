.PHONY: help dev prod build-dev build-prod clean logs stop test

# Default target
help: ## Show this help message
	@echo "Config Manager Development and Deployment"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment with hot reload
	@echo "🔥 Starting development environment with hot reload..."
	docker-compose -f docker-compose.dev.yaml up --build

prod: ## Start production environment
	@echo "🏭 Starting production environment..."
	docker-compose up --build

build-dev: ## Build development images
	@echo "🔨 Building development images..."
	docker-compose -f docker-compose.dev.yaml build

build-prod: ## Build production images
	@echo "🔨 Building production images..."
	docker-compose build

logs: ## Show logs from all services
	docker-compose logs -f

logs-dev: ## Show logs from development services
	docker-compose -f docker-compose.dev.yaml logs -f

stop: ## Stop all running services
	@echo "🛑 Stopping all services..."
	docker-compose down
	docker-compose -f docker-compose.dev.yaml down

clean: ## Remove all containers, images, and volumes
	@echo "🧹 Cleaning up..."
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yaml down -v --rmi all

restart-dev: ## Restart development environment
	@echo "🔄 Restarting development environment..."
	docker-compose -f docker-compose.dev.yaml down
	docker-compose -f docker-compose.dev.yaml up --build

restart-prod: ## Restart production environment
	@echo "🔄 Restarting production environment..."
	docker-compose down
	docker-compose up --build

test: ## Run Go tests with race detection in development environment
	@echo "🧪 Running Go tests with race detection..."
	docker-compose -f docker-compose.dev.yaml run --rm pocketbase go test -race -count 1 ./...