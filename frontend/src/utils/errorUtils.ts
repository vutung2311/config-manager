// Utility functions for error handling

/**
 * Extracts status code from various error structures
 * Handles different API client error formats (axios, fetch, etc.)
 */
export const getStatusCode = (error: any): string => {
  // Try different common error structures
  const status = error?.status ||
                 error?.response?.status ||
                 error?.data?.status ||
                 error?.originalError?.response?.status ||
                 error?.error?.response?.status ||
                 error?.code ||
                 error?.statusCode;

  return status?.toString() || "unknown";
};
