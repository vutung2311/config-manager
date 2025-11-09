import PocketBase from 'pocketbase/cjs';
import type { DataProvider } from "@refinedev/core";
import { POCKETBASE_URL } from "./config";

const pb = new PocketBase(POCKETBASE_URL);

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters, sorters }) => {
    const { current = 1, pageSize = 10 } = pagination || {} as any;

    // Build options object for PocketBase getList
    const options: any = {};

    // Apply filters
    if (filters && filters.length > 0) {
      const filterExpressions = filters.map(filter => {
        const { field, operator, value } = filter as any;

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
      }).filter(expr => expr.length > 0);

      if (filterExpressions.length > 0) {
        options.filter = filterExpressions.join(' && ');
      }
    }

    // Apply sorters
    if (sorters && sorters.length > 0) {
      const sortStr = sorters.map(sorter => {
        return sorter.order === 'desc' ? `-${sorter.field}` : sorter.field;
      }).join(',');

      options.sort = sortStr;
    }

    const response = await pb.collection(resource).getList(current, pageSize, options);
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
    const record = await pb.collection(resource).create(variables as any);
    return {
      data: record as any,
    };
  },

  update: async ({ resource, id, variables }) => {
    const record = await pb.collection(resource).update(id as string, variables as any);
    return {
      data: record as any,
    };
  },

  deleteOne: async ({ resource, id }) => {
    await pb.collection(resource).delete(id as string);
    return {
      data: { id } as any,
    };
  },

  getApiUrl: () => {
    return pb.baseUrl;
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  },
};
