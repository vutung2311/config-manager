import { useCallback, useEffect, useState } from 'react';
import { authProvider } from '../../authProvider';

/**
 * This hook is used to automatically login the user.
 * We use this hook to skip the login page and demonstrate the application more quickly.
 */
export const useAutoLogin = () => {
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback(async () => {
    try {
      await authProvider.login({
        email: import.meta.env.VITE_ADMIN_EMAIL,
        password: import.meta.env.VITE_ADMIN_PASSWORD,
      });
    } catch (_error) {
      // Ignore login errors for auto-login
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const shouldLogin = localStorage.getItem('auto_login') === 'true';
    if (!shouldLogin) {
      setIsLoading(false);
      return;
    }

    login();
  }, []);

  return { loading: isLoading };
};

/**
 *  Enable auto login feature.
 *  This is used to skip the login page and demonstrate the application more quickly.
 */
export const enableAutoLogin = () => {
  localStorage.setItem('auto_login', 'true');
};

/**
 *  Disable auto login feature.
 *  This is used to skip the login page and demonstrate the application more quickly.
 */
export const disableAutoLogin = () => {
  localStorage.setItem('auto_login', 'false');
};
