import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useDataProvider } from "@refinedev/core";
import { capitalizeWords } from "../../utils";
import type { IConfigurationTemplate } from "../../interfaces";

export interface IDynamicMenuItem {
  name: string;
  list: string;
  create: string;
  edit: string;
  show: string;
  meta: {
    label: string;
    icon: any;
    templateId: string;
  };
}

interface DynamicMenuContextType {
  dynamicMenus: IDynamicMenuItem[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const DynamicMenuContext = createContext<DynamicMenuContextType | undefined>(undefined);

export const DynamicMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getDataProvider = useDataProvider();
  const [templatesData, setTemplatesData] = useState<IConfigurationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setIsLoading(true);

      // Check if we're in Cypress test environment
      if (window.Cypress) {
        // In test environment, don't fetch from API, use mock data from window
        const mockTemplates = (window as any).mockTemplates || [];
        setTemplatesData(mockTemplates);
        setError(null);
        setIsLoading(false);
        return;
      }

      const dataProvider = getDataProvider();
      const result = await dataProvider.getList<IConfigurationTemplate>({
        resource: "configuration_templates",
      });
      setTemplatesData(result.data || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setTemplatesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [getDataProvider]);

  useEffect(() => {
    fetchTemplates();
  }, [getDataProvider]);

  // Refetch templates when they might have changed (every 500ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTemplates();
    }, 500);

    return () => clearInterval(interval);
  }, [fetchTemplates]);

  // Listen for custom events to refetch (for testing)
  useEffect(() => {
    const handleRefetch = () => {
      fetchTemplates();
    };

    window.addEventListener('refetch-templates', handleRefetch);

    return () => {
      window.removeEventListener('refetch-templates', handleRefetch);
    };
  }, [fetchTemplates]);

  const dynamicMenus: IDynamicMenuItem[] = useMemo(() => {
    if (!templatesData) return [];

    return templatesData.map((template: IConfigurationTemplate) => {
      const menuName = `configurations_${template.id}`;
      const displayName = capitalizeWords(template.name);

      return {
        name: menuName,
        list: `/configurations/${template.id}`,
        create: `/configurations/${template.id}/create`,
        edit: `/configurations/${template.id}/edit/:id`,
        show: `/configurations/${template.id}/:id`,
        meta: {
          label: displayName,
          icon: null, // Will be set by the parent component
          templateId: template.id,
        },
      };
    });
  }, [templatesData]);

  const refetch = async () => {
    await fetchTemplates();
  };

  const value: DynamicMenuContextType = {
    dynamicMenus,
    isLoading,
    error,
    refetch,
  };

  return (
    <DynamicMenuContext.Provider value={value}>
      {children}
    </DynamicMenuContext.Provider>
  );
};

export const useDynamicMenuContext = () => {
  const context = useContext(DynamicMenuContext);
  if (context === undefined) {
    throw new Error("useDynamicMenuContext must be used within a DynamicMenuProvider");
  }
  return context;
};
