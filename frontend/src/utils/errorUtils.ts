// Utility functions for error handling

/**
 * Extracts status code from various error structures
 * Handles different API client error formats (axios, fetch, etc.)
 */
export const getStatusCode = (error: any): string => {
  // Try different common error structures
  const status =
    error?.status ||
    error?.response?.status ||
    error?.data?.status ||
    error?.originalError?.response?.status ||
    error?.error?.response?.status ||
    error?.code ||
    error?.statusCode;

  return status?.toString() || 'unknown';
};

/**
 * Parses backend validation errors and returns user-friendly error messages
 * @param error - The error object from the API
 * @returns Object with parsed error message and field-specific errors
 */
export const parseValidationErrors = (
  error: any
): { message: string; fieldErrors?: Record<string, string> } => {
  const errorData = error?.response?.data?.data || error?.data?.data;

  if (errorData && typeof errorData === 'object') {
    const fieldErrors: Record<string, string> = {};
    const errorMessages: string[] = [];

    Object.entries(errorData).forEach(([field, errorInfo]: [string, any]) => {
      if (errorInfo && typeof errorInfo === 'object' && errorInfo.message) {
        // Generic field name conversion: snake_case to Title Case
        const fieldName = field
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const errorMessage = `${fieldName}: ${errorInfo.message}`;
        fieldErrors[field] = errorMessage;
        errorMessages.push(errorMessage);
      }
    });

    if (errorMessages.length > 0) {
      return {
        message: errorMessages.join('\n'),
        fieldErrors,
      };
    }
  }

  // Fallback to generic message
  return {
    message:
      error?.response?.data?.message ||
      error?.message ||
      error?.data?.message ||
      'An unexpected error occurred',
  };
};
