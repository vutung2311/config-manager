# Game Configurator

A modern web application built with Refine and PocketBase for managing game advertising configurations.

## Features

- **Game Management**: Configure and manage game identifiers
- **Advertisement Configurations**: Set up ad network configurations for games
- **Advertisement Placements**: Define where ads appear within games
- **Authentication**: Secure login using PocketBase authentication
- **Admin Panel**: Full-featured admin interface with Refine
- **Docker Support**: Easy deployment with Docker Compose
- **Real-time**: Live updates using PocketBase real-time features
- **TypeScript**: Full TypeScript support for better development experience

## Tech Stack

- **Frontend**: React, Refine, Ant Design, TypeScript
- **Backend**: PocketBase (Go-based backend)
- **Deployment**: Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Make (optional, for using the Makefile)

### Development Setup

1. Clone the repository
2. Choose your development mode:

   **Option A: Using Makefile (recommended)**
   ```bash
   make dev          # Development with hot reload
   make prod         # Production-like environment
   make help         # Show all available commands
   ```

   **Option B: Using Docker Compose directly**
   ```bash
   # Development with hot reload
   docker-compose -f docker-compose.dev.yaml up --build

   # Production mode
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173 (auto-detects PocketBase on port 8081)
   - PocketBase Admin: http://localhost:8081/_/

### Configuration

The frontend automatically detects the PocketBase backend URL:
- **Same Host Development**: Automatically uses `localhost:8081`
- **Production**: Uses current domain with appropriate port
- **Manual Override**: Set `VITE_POCKETBASE_URL` environment variable if needed

### Production Deployment

For production deployment with data persistence:

1. Set your encryption key:
   ```bash
   export PB_ENCRYPTION_KEY="your-secure-random-key-here"
   ```

2. Run with Docker Compose:
   ```bash
   make prod
   # or
   docker-compose up --build -d
   ```

#### Data Persistence

PocketBase data is persisted using local directory bind mounts:
- **Data Directory**: `./pb_data` → `/pb/pb_data` (excluded from git)
- **Migrations**: `./pb_migrations` → `/pb/pb_migrations` (includes example migration)
- **Hooks**: `./pb_hooks` → `/pb/pb_hooks` (includes example hooks)

#### Backup Strategy

To backup PocketBase data:
```bash
# Stop the container
docker-compose stop pocketbase

# Create backup
tar czf pb_data-backup.tar.gz pb_data/

# Restart the container
docker-compose start pocketbase
```

To restore from backup:
```bash
# Stop the container
docker-compose stop pocketbase

# Restore backup
tar xzf pb_data-backup.tar.gz

# Restart the container
docker-compose start pocketbase
```

## Development Workflow

### Using Makefile (Recommended)

The Makefile provides convenient commands for development and deployment:

```bash
make help         # Show all available commands
make dev          # Start development with hot reload
make prod         # Start production environment
make build-dev    # Build development images only
make build-prod   # Build production images only
make logs         # Show all service logs
make logs-dev     # Show development logs
make stop         # Stop all services
make clean        # Remove containers, images, and volumes
make restart-dev  # Restart development environment
make restart-prod # Restart production environment
```

### Manual Development

1. **Frontend only** (requires backend running separately):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Backend only**:
   ```bash
   docker-compose -f docker-compose.dev.yaml up pocketbase
   ```

3. **Full stack with hot reload**:
   ```bash
   docker-compose -f docker-compose.dev.yaml up
   ```

## First Time Setup

1. Access PocketBase admin at http://localhost:8081/_/
2. Create your first admin user
3. The frontend will automatically connect to your PocketBase instance

## Project Structure

```
game-configurator/
├── backend/
│   ├── Dockerfile              # Multi-stage PocketBase Dockerfile (dev + prod)
│   ├── pb_migrations/          # Database migrations for games, ads, and placements
│   ├── pb_hooks/               # PocketBase custom hooks
│   └── .air.toml               # Air configuration for hot reload
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── games/          # Game management (CRUD operations)
│   │   │   ├── advertisement-configs/  # Ad configuration management
│   │   │   ├── advertisement-placements/ # Ad placement management
│   │   │   ├── auth/           # Authentication pages
│   │   │   └── dashboard/      # Main dashboard
│   │   ├── components/         # Reusable UI components
│   │   ├── config.ts           # Auto-detecting PocketBase URL configuration
│   │   ├── authProvider.ts     # PocketBase authentication provider
│   │   ├── dataProvider.ts     # PocketBase data provider
│   │   └── App.tsx             # Main application component
│   ├── Dockerfile              # Frontend production Docker configuration
│   ├── package.json            # Node.js dependencies
│   └── tsconfig.json           # TypeScript configuration
├── pb_data/                    # PocketBase data (gitignored)
├── docker-compose.yml          # Production Docker Compose
├── docker-compose.dev.yaml     # Development Docker Compose (with hot reload)
├── Makefile                    # Build and deployment recipes
└── README.md
```

## API Integration

The application uses PocketBase JS SDK for:
- User authentication and authorization
- CRUD operations on Games, Advertisement Configs, and Advertisement Placements
- Real-time subscriptions for live updates
- File uploads for game assets and ad materials
- Advanced querying and filtering of game configurations

## Security

- JWT-based authentication
- Secure API communication
- Environment-based configuration
- Docker container isolation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker Compose
5. Submit a pull request

## License

MIT License
