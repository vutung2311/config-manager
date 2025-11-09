import type { DataProvider, CrudFilter } from '@refinedev/core';

// Import the authenticated PocketBase instance from authProvider
// This ensures we use the same authenticated instance
import { pb } from './authProvider';
import { parseValidationErrors } from './utils/errorUtils';

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { currentPage = 1, pageSize = 10 } = pagination || {};

    // Build options object for PocketBase getList
    const options: Record<string, unknown> = {};

    // Apply filters
    if (filters && filters.length > 0) {
      const filterExpressions = (filters as CrudFilter[])
        .map(filter => {
          // Type assertion for LogicalFilter which has field, operator, value
          const logicalFilter = filter as any;
          const { field, operator, value } = logicalFilter;

          // Skip filters with empty values to avoid invalid queries
          if (value === '' || value === null || value === undefined) {
            return '';
          }

          // Handle different operators according to PocketBase filter syntax
          switch (operator) {
            case 'eq':
              return `${field} = "${value}"`;
            case 'ne':
              return `${field} != "${value}"`;
            case 'contains':
              return `${field} ~ "${value}"`;
            case 'ncontains':
              return `${field} !~ "${value}"`;
            case 'lt':
              return `${field} < ${value}`;
            case 'gt':
              return `${field} > ${value}`;
            case 'lte':
              return `${field} <= ${value}`;
            case 'gte':
              return `${field} >= ${value}`;
            case 'in':
              // For 'in' operator, value should be an array
              if (Array.isArray(value)) {
                return `${field} ?= [${value.map(v => `"${v}"`).join(',')}]`;
              }
              return '';
            case 'nin':
              // For 'nin' operator, value should be an array
              if (Array.isArray(value)) {
                return `${field} !?= [${value.map(v => `"${v}"`).join(',')}]`;
              }
              return '';
            default:
              // For unsupported operators, try eq as fallback
              return `${field} = "${value}"`;
          }
        })
        .filter(expr => expr.length > 0);

      if (filterExpressions.length > 0) {
        options.filter = filterExpressions.join(' && ');
      }
    }

    // Apply sorters
    if (sorters && sorters.length > 0) {
      const sortStr = sorters
        .map(sorter => {
          return sorter.order === 'desc' ? `-${sorter.field}` : sorter.field;
        })
        .join(',');

      options.sort = sortStr;
    }

    const response = await pb.collection(resource).getList(currentPage, pageSize, options);
    return {
      data: response.items as any[],
      total: response.totalItems,
    };
  },

  getOne: async ({ resource, id }) => {
    const record = await pb.collection(resource).getOne(id as string);
    return {
      data: record as any,
    };
  },

  create: async ({ resource, variables }) => {
    try {
      const record = await pb.collection(resource).create(variables as any);
      return {
        data: record as any,
      };
    } catch (error: unknown) {
      // Let 401 and 403 errors bubble up to authProvider's onError handler
      const errorObj = error as any;
      if (errorObj?.response?.status > 400) {
        throw error;
      }

      // For other errors, parse validation errors and enhance the original error
      const parsedError = parseValidationErrors(error);

      // Create an enhanced error that preserves the original structure but includes parsed message
      const enhancedError = new Error(parsedError.message);
      (enhancedError as any).response = errorObj?.response;
      (enhancedError as any).data = errorObj?.data;
      // Attach the parsed field errors for potential future use
      (enhancedError as any).fieldErrors = parsedError.fieldErrors;

      throw enhancedError;
    }
  },

  update: async ({ resource, id, variables }) => {
    try {
      const record = await pb.collection(resource).update(id as string, variables as any);
      return {
        data: record as any,
      };
    } catch (error: unknown) {
      // Let 401 and 403 errors bubble up to authProvider's onError handler
      const errorObj = error as any;
      if (errorObj?.response?.status > 400) {
        throw error;
      }

      // For other errors, parse validation errors and enhance the original error
      const parsedError = parseValidationErrors(error);

      // Create an enhanced error that preserves the original structure but includes parsed message
      const enhancedError = new Error(parsedError.message);
      (enhancedError as any).response = errorObj?.response;
      (enhancedError as any).data = errorObj?.data;
      // Attach the parsed field errors for potential future use
      (enhancedError as any).fieldErrors = parsedError.fieldErrors;

      throw enhancedError;
    }
  },

  deleteOne: async ({ resource, id }) => {
    try {
      await pb.collection(resource).delete(id as string);
      return {
        data: { id } as any,
      };
    } catch (error: unknown) {
      // Let 401 and 403 errors bubble up to authProvider's onError handler
      const errorObj = error as any;
      if (errorObj?.response?.status > 400) {
        throw error;
      }

      // For other errors, parse validation errors and enhance the original error
      const parsedError = parseValidationErrors(error);

      // Create an enhanced error that preserves the original structure but includes parsed message
      const enhancedError = new Error(parsedError.message);
      (enhancedError as any).response = errorObj?.response;
      (enhancedError as any).data = errorObj?.data;
      // Attach the parsed field errors for potential future use
      (enhancedError as any).fieldErrors = parsedError.fieldErrors;

      throw enhancedError;
    }
  },

  getApiUrl: () => {
    return pb.baseUrl;
  },

  getCollectionSchema: async ({ collection }: { collection: string }) => {
    try {
      const collectionData = await pb.collections.getOne(collection);
      return { data: collectionData };
    } catch (error: unknown) {
      // Let 401 and 403 errors bubble up to authProvider's onError handler
      const errorObj = error as any;
      if (errorObj?.response?.status > 400) {
        throw error;
      }

      throw new Error(`Failed to fetch collection schema for ${collection}`);
    }
  },

  custom: async ({ url, method, filters, sorters, payload, query, headers }) => {
    // For custom requests, we'll use the fetch API directly
    const response = await fetch(`${pb.baseUrl}${url}`, {
      method: method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      // Create an error object that preserves the response for authProvider's onError handler
      const error = new Error(`HTTP error! status: ${response.status}`);
      (error as any).response = {
        status: response.status,
        statusText: response.statusText,
      };
      throw error;
    }

    const data = await response.json();
    return { data };
  },
};
