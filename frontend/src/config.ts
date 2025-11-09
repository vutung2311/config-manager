// Configuration for the application
//
// To configure PocketBase URL:
// - POCKETBASE_URL: Used by backend/build process
// - VITE_POCKETBASE_URL: Exposed to client-side code
//
// For Docker development: both are set in docker-compose.dev.yaml
// For local development: create a .env.local file with both variables
//
// For example:
// POCKETBASE_URL=localhost:8080
// VITE_POCKETBASE_URL=localhost:8080
// POCKETBASE_URL=https://your-production-domain.com
// VITE_POCKETBASE_URL=https://your-production-domain.com
//
export const config = {
  // PocketBase configuration
  pocketbase: {
    url: import.meta.env.VITE_POCKETBASE_URL || 'localhost:8080',
  },
} as const;

// Type-safe access to config values
export const POCKETBASE_URL = config.pocketbase.url;
