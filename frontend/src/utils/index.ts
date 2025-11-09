export * from './unique-list-with-count';
export * from './geocoding';
export * from './errorUtils';

/**
 * Capitalizes the first letter of each word and removes underscores
 * @param str - The string to capitalize
 * @returns The capitalized string without underscores
 */
export const capitalizeWords = (str: string): string => {
  return str
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ') // Split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join back with spaces
};
