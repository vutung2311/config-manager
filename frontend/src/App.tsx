import React from 'react';
import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbarProvider, RefineKbar } from '@refinedev/kbar';
import { useNotificationProvider, ThemedLayout, ErrorComponent } from '@refinedev/antd';
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from '@refinedev/react-router';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router';
import {
  ShoppingOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  ClusterOutlined,
} from '@ant-design/icons';
import { authProvider } from './authProvider';
import { dataProvider } from './dataProvider';

import { DashboardPage } from './pages/dashboard';
import { GameList, GameShow, GameCreate, GameEdit } from './pages/games';
import {
  AdvertisementConfigList,
  AdvertisementConfigShow,
  AdvertisementConfigCreate,
  AdvertisementConfigEdit,
} from './pages/advertisement-configs';
import {
  AdvertisementPlacementList,
  AdvertisementPlacementShow,
  AdvertisementPlacementCreate,
  AdvertisementPlacementEdit,
} from './pages/advertisement-placements';
import { AuthPage } from './pages/auth';
import { useTranslation } from 'react-i18next';
import { Header, Title } from './components';
import { ConfigProvider, GameProvider } from './context';

// Component that handles the layout and uses dynamic menus
const LayoutWrapper: React.FC = () => {
  return (
    <ThemedLayout Header={Header} Title={Title}>
      <Outlet />
    </ThemedLayout>
  );
};

import '@ant-design/v5-patch-for-react-19';
import '@refinedev/antd/dist/reset.css';
import './sider-styles.css';

// Component that uses Refine context
const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const resources = [
    {
      name: 'dashboard',
      list: '/',
      meta: {
        label: 'Dashboard',
        icon: <DashboardOutlined />,
      },
    },
    {
      name: 'games',
      list: '/games',
      create: '/games/create',
      edit: '/games/edit/:id',
      show: '/games/:id',
      meta: {
        label: 'Games',
        icon: <ShoppingOutlined />,
      },
    },
    {
      name: 'advertisements',
      meta: {
        label: 'Advertisements',
        icon: <AppstoreOutlined />,
      },
    },
    {
      name: 'advertisement_configs',
      list: '/advertisement-configs',
      create: '/advertisement-configs/create',
      edit: '/advertisement-configs/edit/:id',
      show: '/advertisement-configs/:id',
      meta: {
        label: 'Configs',
        parent: 'advertisements',
      },
    },
    {
      name: 'advertisements_placements',
      list: '/advertisements-placements',
      create: '/advertisements-placements/create',
      edit: '/advertisements-placements/edit/:id',
      show: '/advertisements-placements/:id',
      meta: {
        label: 'Placements',
        parent: 'advertisements',
      },
    },
  ];

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
      notificationProvider={useNotificationProvider}
      resources={resources}
    >
      <Routes>
        <Route
          element={
            <Authenticated key="authenticated-routes" fallback={<CatchAllNavigate to="/login" />}>
              <LayoutWrapper />
            </Authenticated>
          }
        >
          <Route index element={<DashboardPage />} />

          <Route path="/games">
            <Route index element={<GameList />} />
            <Route path="create" element={<GameCreate />} />
            <Route path="edit/:id" element={<GameEdit />} />
            <Route path=":id" element={<GameShow />} />
          </Route>

          <Route path="/advertisement-configs">
            <Route index element={<AdvertisementConfigList />} />
            <Route path="create" element={<AdvertisementConfigCreate />} />
            <Route path="edit/:id" element={<AdvertisementConfigEdit />} />
            <Route path=":id" element={<AdvertisementConfigShow />} />
          </Route>

          <Route path="/advertisements-placements">
            <Route index element={<AdvertisementPlacementList />} />
            <Route path="create" element={<AdvertisementPlacementCreate />} />
            <Route path="edit/:id" element={<AdvertisementPlacementEdit />} />
            <Route path=":id" element={<AdvertisementPlacementShow />} />
          </Route>
        </Route>

        <Route
          element={
            <Authenticated key="auth-pages" fallback={<Outlet />}>
              <NavigateToResource resource="dashboard" />
            </Authenticated>
          }
        >
          <Route
            path="/login"
            element={
              <AuthPage
                type="login"
                formProps={{
                  initialValues: {
                    email: import.meta.env.VITE_ADMIN_EMAIL,
                    password: import.meta.env.VITE_ADMIN_PASSWORD,
                  },
                }}
              />
            }
          />
          <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
          <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
        </Route>

        <Route
          element={
            <Authenticated key="catch-all">
              <ThemedLayout Header={Header} Title={Title}>
                <Outlet />
              </ThemedLayout>
            </Authenticated>
          }
        >
          <Route path="*" element={<ErrorComponent />} />
        </Route>
      </Routes>
      <UnsavedChangesNotifier />
      <DocumentTitleHandler />
      <RefineKbar />
    </Refine>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ConfigProvider>
        <GameProvider>
          <RefineKbarProvider>
            <AppContent />
          </RefineKbarProvider>
        </GameProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
