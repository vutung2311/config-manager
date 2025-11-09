# Game Configurator Frontend

<div align="center">
<strong>A React-based admin panel built with Refine for managing game advertising configurations.</strong>
</div>

## Features

This admin panel provides comprehensive management for:

- **Games**: Configure and manage game identifiers and metadata
- **Advertisement Configurations**: Set up ad network integrations and settings
- **Advertisement Placements**: Define ad placement strategies within games
- **Dashboard**: Overview and analytics of game configurations
- **Real-time Updates**: Live synchronization with PocketBase backend

## Tech Stack

- **React 19** with TypeScript
- **Refine Framework** for admin panel functionality
- **Ant Design** for UI components
- **PocketBase** for backend API
- **Vite** for build tooling

## Getting Started

### Prerequisites

- Node.js (>= 20)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

### Development

To start the development server:

```bash
npm run dev
```

The application will automatically detect the PocketBase backend URL when running on the same host, eliminating the need to manually configure environment variables for local development.

### Configuration

The app automatically detects PocketBase URL:
- **Development**: `localhost:8081` (when services run on same host)
- **Production**: Uses current domain with appropriate port
- **Manual Override**: Set `VITE_POCKETBASE_URL` environment variable if needed

### Build

To build the application for production:

```bash
npm run build
```

### Preview

To preview the production build:

```bash
npm run preview
```
