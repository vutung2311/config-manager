import { useDynamicMenuContext } from "../../context";

/**
 * Hook to generate dynamic menu items based on configuration templates
 * Each configuration template becomes a menu item that shows configurations filtered by that template
 * Uses the global dynamic menu context to share state across the app
 */
export const useDynamicConfigurationMenus = () => {
  return useDynamicMenuContext();
};
