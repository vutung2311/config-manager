// Configuration for the application
//
// PocketBase URL configuration:
// - VITE_POCKETBASE_URL: If defined, use this URL directly
// - If not defined, auto-detect based on current Refine location (same host/protocol, port 8081)
//
// Since Refine and PocketBase are co-hosted by default, the auto-detection works for most cases.
// Override with VITE_POCKETBASE_URL for custom deployments.
//

// Detect PocketBase URL with environment override or auto-detection
function detectPocketBaseUrl(): string {
  // Check for explicit environment override
  const explicitUrl = import.meta.env.VITE_POCKETBASE_URL;
  if (explicitUrl) {
    return explicitUrl;
  }

  // Auto-detect based on current Refine location (co-hosted scenario)
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    // Use same protocol and host as Refine, different port
    return `${protocol}//${hostname}:8081`;
  }

  // Fallback for server-side rendering or when window is not available
  return 'http://localhost:8081';
}

export const config = {
  // PocketBase configuration
  pocketbase: {
    url: detectPocketBaseUrl(),
  },
} as const;

// Type-safe access to config values
export const POCKETBASE_URL = config.pocketbase.url;
