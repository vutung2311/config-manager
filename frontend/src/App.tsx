import React, { useState, useEffect } from "react";
import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider, RefineKbar } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ThemedLayout,
  ErrorComponent,
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import {
  ShoppingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { authProvider } from "./authProvider";
import { dataProvider } from "./dataProvider";


import { DashboardPage } from "./pages/dashboard";
import { ConfigurationTemplateList, ConfigurationTemplateShow, ConfigurationTemplateCreate, ConfigurationTemplateEdit } from "./pages/configuration-templates";
import { GameList, GameShow, GameCreate, GameEdit } from "./pages/games";
import { ConfigurationList, ConfigurationShow, ConfigurationCreate, ConfigurationEdit } from "./pages/configurations";
import { AuthPage } from "./pages/auth";
import { useTranslation } from "react-i18next";
import { Header, Title } from "./components";
import { ConfigProvider, GameProvider, DynamicMenuProvider } from "./context";
import { useDynamicConfigurationMenus } from "./hooks";
import { SettingOutlined } from "@ant-design/icons";

import "@ant-design/v5-patch-for-react-19";
import "@refinedev/antd/dist/reset.css";
import "./sider-styles.css";


// Component that uses Refine context
const AppContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { dynamicMenus } = useDynamicConfigurationMenus();
  const [resources, setResources] = useState<any[]>([]);

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  // Update resources when dynamic menus change
  useEffect(() => {
    const baseResources = [
      {
        name: "dashboard",
        list: "/",
        meta: {
          label: "Dashboard",
          icon: <DashboardOutlined />,
        },
      },
      {
        name: "configuration_templates",
        list: "/configuration-templates",
        create: "/configuration-templates/create",
        edit: "/configuration-templates/edit/:id",
        show: "/configuration-templates/:id",
        meta: {
          label: "Configuration Templates",
          icon: <ShoppingOutlined />,
        },
      },
      {
        name: "games",
        list: "/games",
        create: "/games/create",
        edit: "/games/edit/:id",
        show: "/games/:id",
        meta: {
          label: "Games",
          icon: <ShoppingOutlined />,
        },
      },
    ];

    const dynamicResources = dynamicMenus.map((menu) => ({
      ...menu,
      meta: {
        ...menu.meta,
        icon: <SettingOutlined />,
      },
    }));

    setResources([...baseResources, ...dynamicResources]);
  }, [dynamicMenus]);

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
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <ThemedLayout Header={Header} Title={Title}>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />


                <Route path="/configuration-templates">
                  <Route index element={<ConfigurationTemplateList />} />
                  <Route path="create" element={<ConfigurationTemplateCreate />} />
                  <Route path="edit/:id" element={<ConfigurationTemplateEdit />} />
                  <Route path=":id" element={<ConfigurationTemplateShow />} />
                </Route>

                <Route path="/games">
                  <Route index element={<GameList />} />
                  <Route path="create" element={<GameCreate />} />
                  <Route path="edit/:id" element={<GameEdit />} />
                  <Route path=":id" element={<GameShow />} />
                </Route>

                {/* Configuration routes */}
                <Route path="/configurations">
                  <Route index element={<ConfigurationList />} />
                  <Route path="create" element={<ConfigurationCreate />} />
                  <Route path="edit/:id" element={<ConfigurationEdit />} />
                  {/* Template-specific routes */}
                  <Route path=":templateId">
                    <Route index element={<ConfigurationList />} />
                    <Route path="create" element={<ConfigurationCreate />} />
                    <Route path="edit/:configId" element={<ConfigurationEdit />} />
                    <Route path=":configId" element={<ConfigurationShow />} />
                  </Route>
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
                <Route
                  path="/forgot-password"
                  element={<AuthPage type="forgotPassword" />}
                />
                <Route
                  path="/update-password"
                  element={<AuthPage type="updatePassword" />}
                />
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
          <DynamicMenuProvider>
            <RefineKbarProvider>
              <AppContent />
            </RefineKbarProvider>
          </DynamicMenuProvider>
        </GameProvider>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
